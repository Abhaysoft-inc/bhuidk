import hashlib
import hmac
import json
import base64
import secrets
import time
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from config import settings

def _base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")

def _base64url_decode(data_str: str) -> bytes:
    padding = "=" * (4 - (len(data_str) % 4)) if len(data_str) % 4 != 0 else ""
    return base64.urlsafe_b64decode(data_str + padding)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a password against the stored hash format (salt$hash)."""
    try:
        if "$" not in hashed_password:
            return plain_password == hashed_password
        salt, stored_hash = hashed_password.split("$", 1)
        calc_hash = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
        return secrets.compare_digest(calc_hash, stored_hash)
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    """Generates a PBKDF2-SHA256 hash with unique salt."""
    salt = secrets.token_hex(16)
    hashed = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
    return f"{salt}${hashed}"

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Creates an RFC-compliant HS256 JWT token using Python standard library."""
    to_encode = data.copy()
    now_ts = int(time.time())
    if expires_delta:
        exp_ts = now_ts + int(expires_delta.total_seconds())
    else:
        exp_ts = now_ts + (settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    
    to_encode.update({"iat": now_ts, "exp": exp_ts})
    
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = _base64url_encode(json.dumps(header, separators=(",", ":")).encode("utf-8"))
    payload_b64 = _base64url_encode(json.dumps(to_encode, separators=(",", ":")).encode("utf-8"))
    
    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    signature = hmac.new(settings.SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
    sig_b64 = _base64url_encode(signature)
    
    return f"{header_b64}.{payload_b64}.{sig_b64}"

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """Decodes and cryptographically verifies an HS256 JWT token."""
    try:
        parts = token.strip().split(".")
        if len(parts) != 3:
            return None
        header_b64, payload_b64, sig_b64 = parts
        
        # Verify signature
        signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
        expected_sig = hmac.new(settings.SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
        actual_sig = _base64url_decode(sig_b64)
        
        if not secrets.compare_digest(expected_sig, actual_sig):
            return None
            
        payload_bytes = _base64url_decode(payload_b64)
        payload = json.loads(payload_bytes.decode("utf-8"))
        
        # Verify expiration
        exp = payload.get("exp")
        if exp and int(time.time()) > exp:
            return None  # Expired
            
        return payload
    except Exception:
        return None
