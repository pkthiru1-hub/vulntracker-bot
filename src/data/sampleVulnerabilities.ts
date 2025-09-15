import { Vulnerability } from "@/components/VulnerabilityCard";

export const sampleVulnerabilities: Vulnerability[] = [
  {
    id: "1",
    title: "Dell PowerEdge Server BIOS Authentication Bypass",
    description: "A critical vulnerability in Dell PowerEdge server BIOS allows attackers to bypass authentication mechanisms and gain unauthorized access to system configurations. This could lead to complete system compromise.",
    severity: "critical",
    cvssScore: 9.8,
    publishedDate: "2024-01-15T00:00:00Z",
    vendor: "Dell",
    affectedProducts: ["PowerEdge R740", "PowerEdge R750", "PowerEdge R640"],
    cveId: "CVE-2024-0001",
    source: "Dell Security Advisory",
    sourceUrl: "https://www.dell.com/support/security/en-us"
  },
  {
    id: "2",
    title: "VMware vSphere Remote Code Execution Vulnerability",
    description: "VMware vSphere contains a remote code execution vulnerability in the vCenter Server. An attacker with network access to port 443 may exploit this issue to execute arbitrary code.",
    severity: "high",
    cvssScore: 8.1,
    publishedDate: "2024-01-12T00:00:00Z",
    vendor: "VMware (Broadcom)",
    affectedProducts: ["vSphere 7.0", "vSphere 8.0", "vCenter Server"],
    cveId: "CVE-2024-0002",
    source: "VMware Security Advisory",
    sourceUrl: "https://www.broadcom.com/support/vmware-security-advisories"
  },
  {
    id: "3",
    title: "Microsoft Exchange Server Privilege Escalation",
    description: "A privilege escalation vulnerability exists in Microsoft Exchange Server. An authenticated attacker could exploit this vulnerability to gain elevated privileges on the affected system.",
    severity: "high",
    cvssScore: 7.8,
    publishedDate: "2024-01-10T00:00:00Z",
    vendor: "Microsoft",
    affectedProducts: ["Exchange Server 2019", "Exchange Server 2016", "Exchange Online"],
    cveId: "CVE-2024-0003",
    source: "Microsoft Security Updates",
    sourceUrl: "https://learn.microsoft.com/en-us/security-updates/"
  },
  {
    id: "4",
    title: "Cisco ASA SSL VPN Path Traversal Vulnerability",
    description: "A path traversal vulnerability in Cisco Adaptive Security Appliance (ASA) SSL VPN feature could allow an unauthenticated, remote attacker to conduct directory traversal attacks.",
    severity: "medium",
    cvssScore: 6.5,
    publishedDate: "2024-01-08T00:00:00Z",
    vendor: "Cisco",
    affectedProducts: ["ASA 5500 Series", "ASA 5500-X Series", "Firepower 2100"],
    cveId: "CVE-2024-0004",
    source: "Cisco Security Advisory",
    sourceUrl: "https://sec.cloudapps.cisco.com/security/center/publicationListing.x"
  },
  {
    id: "5",
    title: "Palo Alto Networks PAN-OS Command Injection",
    description: "A command injection vulnerability in PAN-OS allows an authenticated administrator to execute arbitrary OS commands with root privileges through the web interface.",
    severity: "high",
    cvssScore: 8.4,
    publishedDate: "2024-01-05T00:00:00Z",
    vendor: "Palo Alto Networks",
    affectedProducts: ["PAN-OS 10.2", "PAN-OS 11.0", "PAN-OS 11.1"],
    cveId: "CVE-2024-0005",
    source: "Palo Alto Security Advisory",
    sourceUrl: "https://security.paloaltonetworks.com/"
  },
  {
    id: "6",
    title: "SonicWall NSM SQL Injection Vulnerability",
    description: "Multiple SQL injection vulnerabilities exist in SonicWall Network Security Manager (NSM) that could allow an authenticated attacker to execute arbitrary SQL commands.",
    severity: "medium",
    cvssScore: 6.8,
    publishedDate: "2024-01-03T00:00:00Z",
    vendor: "SonicWall",
    affectedProducts: ["NSM 2600", "NSM On-Prem", "NSM Cloud"],
    cveId: "CVE-2024-0006",
    source: "SonicWall PSIRT Advisory",
    sourceUrl: "https://psirt.global.sonicwall.com/"
  },
  {
    id: "7",
    title: "CISA Alert: Widespread Exploitation of Known Vulnerabilities",
    description: "CISA has observed widespread exploitation of several known vulnerabilities across multiple vendor products. Organizations should prioritize patching these critical security flaws.",
    severity: "critical",
    publishedDate: "2024-01-01T00:00:00Z",
    vendor: "Multiple Vendors",
    affectedProducts: ["Various Network Devices", "Web Applications", "Operating Systems"],
    source: "CISA Cybersecurity Advisory",
    sourceUrl: "https://www.cisa.gov/news-events/cybersecurity-advisories"
  },
  {
    id: "8",
    title: "Google Cloud IAM Service Account Key Exposure Risk",
    description: "Google Cloud has identified potential risks related to service account key exposure in certain configurations. Users should review and rotate keys as recommended.",
    severity: "medium",
    cvssScore: 5.4,
    publishedDate: "2023-12-28T00:00:00Z",
    vendor: "Google Cloud",
    affectedProducts: ["Cloud IAM", "Compute Engine", "GKE"],
    source: "Google Cloud Security Bulletin",
    sourceUrl: "https://cloud.google.com/support/bulletins"
  }
];