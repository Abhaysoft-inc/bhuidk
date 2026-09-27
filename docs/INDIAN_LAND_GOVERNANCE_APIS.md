# Indian Geospatial Land Governance & Ownership APIs: Technical Architecture Guide

> **Scope**: A comprehensive technical and institutional guide to obtaining cadastral boundaries, land ownership (Record of Rights), unique land parcel identification (ULPIN/Bhu-Aadhaar), and physical land use (LULC) for arbitrary geographic polygons, circles, or corridors across India.

---

## 1. Executive Summary & Constitutional Context

When drawing or uploading an arbitrary boundary (polygon, circle, corridor) on a map in India, obtaining real-world data—**who owns it, what it is legally zoned for, and what it is physically used for**—involves integrating three distinct institutional layers.

### Why is there no single central API?
Under the **Constitution of India (Seventh Schedule, List II — State List, Entry 18)**:
> *"Land, that is to say, rights in or over land, land tenures including the relation of landlord and tenant, and the collection of rents; transfer and alienation of agricultural land; land improvement and agricultural loans; colonization."*

Because land is fundamentally a **State subject**, every state maintains its own revenue laws, survey methodologies, terminology, and digital record repositories. The Central Government provides national standardization frameworks (**DILRMP**, **ULPIN / Bhu-Aadhaar**, **PM GatiShakti**), but actual parcel geometries and ownership registries are hosted in **State Data Centres (SDCs)**.

---

## 2. The Three Pillars of Land Intelligence

```
                        ┌───────────────────────────────────────────────┐
                        │   User-Drawn Boundary (Polygon / GeoJSON)     │
                        └───────────────────────┬───────────────────────┘
                                                │
         ┌──────────────────────────────────────┼──────────────────────────────────────┐
         ▼                                      ▼                                      ▼
┌─────────────────────────────┐  ┌─────────────────────────────┐  ┌─────────────────────────────┐
│          PILLAR 1           │  │          PILLAR 2           │  │          PILLAR 3           │
│  Cadastral Map & Geometry   │  │    Ownership & Tenure       │  │ Physical Land Use (LULC)    │
├─────────────────────────────┤  ├─────────────────────────────┤  ├─────────────────────────────┤
│ • NIC BhuNaksha             │  │ • API Setu (apisetu.gov.in) │  │ • ISRO Bhuvan (NRSC)        │
│ • ULPIN / Bhu-Aadhaar       │  │ • State Revenue RoR Portals │  │ • Sentinel-2 10m LULC       │
│ • Khasra / Survey Polygons  │  │ • Khata / Jamabandi / 7/12  │  │ • ESA WorldCover            │
│ • OGC WFS / WMS protocols   │  │ • REST APIs / JSON / XML    │  │ • OGC WMS / Cloud GeoTIFF   │
└──────────────┬──────────────┘  └──────────────┬──────────────┘  └──────────────┬──────────────┘
               │                                │                                │
               └────────────────────────────────┼────────────────────────────────┘
                                                ▼
                        ┌───────────────────────────────────────────────┐
                        │ Integrated Cadastral & Land Impact Dossier    │
                        │ • Intersected Parcels & ULPINs                │
                        │ • Private vs Govt / Nazul Land Breakdown      │
                        │ • Cultivated vs Barren vs Waterbody Areas     │
                        │ • Regulatory Clearances & Buffer Overlays     │
                        └───────────────────────────────────────────────┘
```

---

## 3. Pillar 1: Cadastral Boundaries & ULPIN (Bhu-Aadhaar)

### A. ULPIN (Unique Land Parcel Identification Number)
- **Governing Body**: Department of Land Resources (DoLR), Ministry of Rural Development.
- **Concept**: Often referred to as **"Bhu-Aadhaar"**, ULPIN is a unique **14-digit alphanumeric code** assigned to every surveyed land parcel.
- **Algorithm**: The 14 digits are derived mathematically from the **centroid and vertex coordinates** of the parcel based on international standards (ISO:19152 LADM - Land Administration Domain Model).
- **Format**: Based on lat-long encoding + check bits (e.g., `12AA3456789012`).

### B. BhuNaksha (National Informatics Centre)
- **Deployment**: Powers cadastral mapping in **24+ Indian States and Union Territories** (Maharashtra, UP, MP, Rajasthan, Odisha, Bihar, Assam, Chhattisgarh, Jharkhand, etc.).
- **Engine**: Developed by NIC using open-source GIS software (GeoServer, PostGIS, MapServer).
- **Service Type**: Implements standard **OGC WFS (Web Feature Service)** and **WMS (Web Map Service)**.
- **How Spatial Querying Works**:
  1. Your application sends an OGC WFS `GetFeature` request with a spatial filter:
     ```xml
     <wfs:GetFeature service="WFS" version="1.1.0" outputFormat="application/json">
       <wfs:Query typeName="bhunaksha:cadastral_parcels">
         <ogc:Filter>
           <ogc:Intersects>
             <ogc:PropertyName>geometry</ogc:PropertyName>
             <gml:Polygon srsName="EPSG:4326">
               <gml:exterior>
                 <gml:LinearRing>
                   <gml:posList>77.541 28.320 77.545 28.322 77.548 28.318 77.541 28.320</gml:posList>
                 </gml:LinearRing>
               </gml:exterior>
             </gml:Polygon>
           </ogc:Intersects>
         </ogc:Filter>
       </wfs:Query>
     </wfs:GetFeature>
     ```
  2. BhuNaksha returns GeoJSON containing all intersecting parcels:
     - `khasra_no` / `survey_no`
     - `ulpin`
     - `village_code` (LGD - Local Government Directory code)
     - `parcel_area_sqm`

---

## 4. Pillar 2: Ownership, Tenure & Record of Rights (RoR)

Once your application retrieves the list of intersected Khasra numbers or ULPINs, it queries the state's **Record of Rights (RoR)** registry.

### What RoR Data Contains:
- **Tenure Classification**:
  - **Private / Khatedari** (Occupancy rights / freehold)
  - **Government Land** (*Nazul*, *Gair Mumkin*, Revenue Department land)
  - **Gram Panchayat / Common Land** (*Shamlat Deh*, *Gochar* pasture)
  - **Forest Land** (*Van Vibhag* reserve/protected)
  - **Waqf Board / Religious Trust**
- **Ownership Identity**: Landowner name, co-owners, share percentage.
- **Encumbrance Status**: Bank hypothecation, court litigations, revenue dues.
- **Land Class in Revenue Records**: Irrigated (*Nehri*, *Chahi*), Unirrigated (*Barani*), Residential (*Abadi*).

### National API Gateway: API Setu (`apisetu.gov.in`)
- Operated by **MeitY / National Informatics Centre (NIC)**.
- Serves as the central API clearinghouse for Digital India.
- Hosts published REST APIs for state land registries:

| State | Portal Name | Document Type | Query Parameters |
| :--- | :--- | :--- | :--- |
| **Maharashtra** | *MahaBhumi / Aapli Chavdi* | 7/12 & 8A Extract | District, Taluka, Village, Survey No / GAT No |
| **Uttar Pradesh** | *Bhulekh UP* | *Khatauni* / *Khasra* | Village LGD, Khata Number / Khasra Number |
| **Karnataka** | *Bhoomi / Mojini* | RTC (Pahani) | District, Taluk, Hobli, Village, Survey Number, Hissa |
| **Madhya Pradesh** | *MP Bhulekh* | *Khasra-Khatauni* | District, Tehsil, Village, Khasra ID |
| **Telangana** | *Dharani Portal* | Passbook / RoR-1B | District, Mandal, Village, Khata / Survey No |
| **Andhra Pradesh** | *Meebhoomi* | 1-B Adangal | District, Mandal, Village, Survey No |
| **Gujarat** | *AnyRoR* | 7/12 & 8A | District, Taluka, Village, Survey Number |
| **Rajasthan** | *Apna Khata (E-Dharti)* | *Jamabandi* / *Nakal* | District, Tehsil, Village, Khasra Number |

---

## 5. Pillar 3: Physical Land Use / Land Cover (LULC)

Legal revenue records often lag behind physical ground reality by years. To know what the land is **actually being used for today**, satellite remote sensing APIs are used:

### A. ISRO Bhuvan (NRSC - National Remote Sensing Centre)
- **Portal**: [bhuvan.nrsc.gov.in](https://bhuvan.nrsc.gov.in)
- **Datasets**:
  - **LULC 1:50,000 Scale**: High-accuracy national land use mapping.
  - **Wasteland Atlas**: Barren rocky, saline, scrub, degraded land.
  - **Water Bodies & Wetlands**: Inland wetlands, seasonal waterbodies.
  - **Geomorphology & Groundwater Prospects**.
- **Protocols**: OGC WMS (`GetMap`), WMTS (Tile Service), and WFS (`GetFeature`).
- **Endpoint Pattern**:
  ```
  https://bhuvan-vec1.nrsc.gov.in/bhuvan/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=lulc:LULC50K_2021&CRS=EPSG:4326&BBOX=...
  ```

### B. Global Open 10m LULC (Sentinel-2 / ESA WorldCover)
For zero-barrier integration without institutional approvals:
- **Sentinel-2 10m Land Use/Land Cover** (Impact Observatory / ESRI):
  - Updated annually with AI classification over 10m resolution imagery.
  - Classes: `1: Water`, `2: Trees`, `4: Flooded Vegetation`, `5: Crops`, `7: Built Area`, `8: Bare Ground`, `9: Snow/Ice`, `10: Clouds`, `11: Rangeland`.
- **ESA WorldCover 10m**:
  - Available on AWS Open Data and Google Earth Engine (GEE).
  - Can be queried via GEE REST API or custom cloud-native GeoTIFF (COG) sampling.

---

## 6. Strategic Government Platforms

### A. PM GatiShakti National Master Plan (BISAG-N)
- Managed by **BISAG-N** (Bhaskaracharya National Institute for Space Applications and Geo-informatics).
- Aggregates over **1,400+ GIS layers** across all central and state infrastructure departments.
- Used for major linear projects (Bharatmala highways, Dedicated Freight Corridors, pipeline rights of way, industrial smart cities).
- When a planner draws an alignment on GatiShakti:
  - Generates instant multi-departmental clearance reports.
  - Detects overlap with Reserved Forests, Wildlife Corridors, Mining Leases, Defense Zones, and ASI Protected Monuments.

### B. MoEFCC PARIVESH
- **Portal**: [parivesh.nic.in](https://parivesh.nic.in)
- Single-window environmental, forest, wildlife, and CRZ (Coastal Regulation Zone) clearances.
- Contains GIS polygons of all Recorded Forest Areas (RFA), National Parks, Tiger Reserves, and Eco-Sensitive Zones (ESZ buffers).

### C. Survey of India (SoI) & SVAMITVA Scheme
- **SVAMITVA** (*Survey of Villages and Mapping with Improvised Technology in Village Areas*):
  - Uses professional survey-grade drones (5 cm accuracy) with CORS networks to map inhabited rural areas (*Abadi*).
  - Generates digitized **Property Cards** for rural households with exact 3D GIS coordinates.

---

## 7. Developer Access & Legal Constraints (DPDP Act 2023)

### Why aren't full ownership names open via unauthenticated APIs?
1. **Digital Personal Data Protection Act, 2023 (DPDP Act)**:
   - A person's land ownership, financial lien, and residential address are classified as personal data.
   - Bulk unauthenticated APIs would allow unauthorized scrapers to aggregate citizen asset wealth and build commercial profiling databases.
2. **Anti-Speculation Controls**:
   - Open bulk ownership querying could enable real-estate speculators to target vulnerable landowners ahead of infrastructure corridor announcements.

### How Organizations Legally Access These APIs:
1. **Govt-to-Govt (G2G)**: Departments integrate directly via State Data Centre VPCs or NIC intranet.
2. **Govt-to-Business (G2B)**: Registered entities (banks for Kisan Credit Card verification, infrastructure concessionaires, recognized research bodies) apply for API credentials on **API Setu** (`apisetu.gov.in`) with designated end-use consent forms.
3. **Public Interfaces**: Citizens query one parcel at a time using Captcha on state Bhulekh/MahaBhumi portals.

---

## 8. Implementation Strategy for BhoomiIntel / BLIN

In your current application architecture, you can run a **hybrid three-tier pipeline**:

```
[User Draws Polygon / Uploads GeoJSON]
                 │
                 ▼
┌────────────────────────────────────────────────────────┐
│ Tier 1: Client / Edge Spatial Computation (Active Now) │
│ • Compute exact area (Ha, Sq.m), perimeter, bbox       │
│ • Detect State & District from centroid lookup         │
│ • Local cadastral heuristic model (parcels, LULC %)    │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│ Tier 2: Open Spatial Layers (Immediate Upgrade)        │
│ • OpenStreetMap Cadastral / Landuse tags               │
│ • Sentinel-2 10m LULC raster tile intersection         │
│ • Bhuvan Open WMS layer visualization                  │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│ Tier 3: Production Institutional Integration (Target)  │
│ • Webhook to NIC BhuNaksha WFS (parcel geometry)       │
│ • Webhook to API Setu RoR endpoint (7/12, Khatauni)    │
│ • GatiShakti compliance check export                   │
└────────────────────────────────────────────────────────┘
```

---

## 9. Key Government Reference Links

- **ULPIN / Bhu-Aadhaar Portal**: [dolr.gov.in/ulpin-bhu-aadhaar](https://dolr.gov.in)
- **National Informatics Centre BhuNaksha**: [bhunaksha.nic.in](https://bhunaksha.nic.in)
- **National API Exchange (API Setu)**: [apisetu.gov.in](https://apisetu.gov.in)
- **ISRO Bhuvan Geo-Portal**: [bhuvan.nrsc.gov.in](https://bhuvan.nrsc.gov.in)
- **PM GatiShakti National Master Plan**: [gatishakti.gov.in](https://gatishakti.gov.in)
- **MoEFCC PARIVESH Environmental Portal**: [parivesh.nic.in](https://parivesh.nic.in)
- **Survey of India Geospatial Portal**: [onlinemaps.surveyofindia.gov.in](https://onlinemaps.surveyofindia.gov.in)
