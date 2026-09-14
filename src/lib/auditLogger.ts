import crypto from 'crypto';

export interface AuditLogEntry {
  id: string;
  action: string;
  initiator: string;
  timestamp: string;
  previousHash: string;
  currentHash: string;
}

// In a real implementation, this would query the DB.
// For the hackathon, we simulate the ledger in memory if DB is unavailable.
let inMemoryLedger: AuditLogEntry[] = [
  {
    id: 'TX-GENESIS',
    action: 'System Initialization',
    initiator: 'system',
    timestamp: new Date('2026-01-01T00:00:00Z').toISOString(),
    previousHash: '0000000000000000000000000000000000000000000000000000000000000000',
    currentHash: crypto.createHash('sha256').update('GENESIS').digest('hex')
  }
];

/**
 * Creates a new hash-chained audit log entry.
 * The current hash is generated using: SHA256(previousHash + action + initiator + timestamp)
 */
export async function createAuditLog(action: string, initiator: string): Promise<AuditLogEntry> {
  const previousEntry = inMemoryLedger[inMemoryLedger.length - 1];
  const previousHash = previousEntry.currentHash;
  
  const timestamp = new Date().toISOString();
  const id = `TX-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  
  // Blockchain-style hash concatenation
  const dataToHash = `${previousHash}|${action}|${initiator}|${timestamp}`;
  const currentHash = crypto.createHash('sha256').update(dataToHash).digest('hex');
  
  const newEntry: AuditLogEntry = {
    id,
    action,
    initiator,
    timestamp,
    previousHash,
    currentHash
  };
  
  // Append to ledger (in a real app, this is an INSERT into Postgres)
  inMemoryLedger.push(newEntry);
  
  return newEntry;
}

/**
 * Verifies the integrity of the entire audit chain.
 * Returns true if all hashes are cryptographically valid and chained correctly.
 */
export function verifyLedgerIntegrity(ledger: AuditLogEntry[] = inMemoryLedger): boolean {
  for (let i = 1; i < ledger.length; i++) {
    const prev = ledger[i - 1];
    const curr = ledger[i];
    
    // 1. Check if the chain is linked
    if (curr.previousHash !== prev.currentHash) {
      return false;
    }
    
    // 2. Re-compute the hash to ensure data wasn't tampered with
    const dataToHash = `${curr.previousHash}|${curr.action}|${curr.initiator}|${curr.timestamp}`;
    const recomputedHash = crypto.createHash('sha256').update(dataToHash).digest('hex');
    
    if (curr.currentHash !== recomputedHash) {
      return false;
    }
  }
  
  return true;
}

/**
 * Retrieves the full ledger.
 */
export function getLedger(): AuditLogEntry[] {
  return inMemoryLedger;
}
