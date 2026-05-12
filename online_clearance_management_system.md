**ONLINE CLEARANCE MANAGEMENT SYSTEM CASE STUDY OF FULAFIA**

**BY**

**MTSER, Emmanuel Terngu**

**(2021/CP/CSC/0076)**

**A PROJECT REPORT SUBMITTED TO THE DEPARTMENT OF COMPUTER SCIENCE,
FACULTY OF COMPUTING, IN PARTIAL FULFILLMENT OF THE REQUIREMENTS FOR THE
AWARD OF BACHELOR OF SCIENCE (BSc) DEGREE IN COMPUTER SCIENCE. OF
FEDERAL UNIVERSITY OF LAFIA.**

**MARCH, 2026**

**CHAPTER ONE**

**INTRODUCTION**

**1.1 Background of the Study**

The rapid expansion of information technology has transformed the
administrative landscape of higher education institutions (HEIs)
globally. Traditionally, university administration relied on paper-based
workflows that were prone to human error and significant delays.

In the 21st century, the drive toward \"Digital Universities\"
necessitates the automation of critical administrative processes to
enhance institutional efficiency and service delivery (Alenezi, 2023).
One such process is student clearance, a mandatory protocol that ensures
a graduating student has fulfilled all academic, financial, and social
obligations before they are formally disengaged from the institution
(Oliha, 2020).

At the Federal University of Lafia (FULafia), the clearance process is a
vital gatekeeping mechanism involving multiple administrative units,
including the Bursary, University Library, Student Affairs, and various
Faculty and Departmental offices (FULafia, 2020). Despite the
university\'s growth, the current clearance procedure remains largely
manual. Students are required to physically navigate the campus to
obtain signatures and rubber stamps, proving they have returned library
books, paid all dues, and fulfilled departmental requirements (Adamu,
2022).

A significant challenge in this environment is the financial
verification phase; at FULafia, clearance payments are predominantly
made physically at banks, requiring students to return to campus with
bank tellers for manual verification. This outdated approach creates a
\"signature-chasing\" cycle that is exhausting for students and
inefficient for staff. Developing an Online Clearance Management System
(OCMS) is thus a strategic necessity to modernize FULafia's
administrative operations and align them with global best practices in
educational technology (Eweoya et al., 2024).

**1.2 Statement of the Problem**

The manual clearance system at the Federal University of Lafia faces
several critical challenges that hinder the smooth graduation of
students:

a.  **Inefficiency and Time Wastage:** Students spend an average of two
    to three weeks navigating various offices, often finding that key
    administrative personnel are unavailable to sign their forms (Adamu,
    2022; Murtala, 2022).

b.  **Manual Payment Bottlenecks:** Since payments are made via bank
    tellers and physical cash, students experience significant delays
    waiting for Bursary staff to verify physical receipts against bank
    statements, a process prone to human error (FULafia, 2023).

c.  **Data Inaccuracy and Record Loss:** Physical documents, such as
    clearance forms and bank tellers, are highly susceptible to loss,
    theft, or damage by environmental factors like rain, leading to
    cases where students are forced to repay dues they have already
    cleared (Ekoro & Bassey, 2024).

d.  **Security Risks:** The reliance on rubber stamps and handwritten
    signatures is inherently vulnerable to forgery and unauthorized
    duplication, which undermines the credibility of the university\'s
    exit process (Jibril & Umar, 2021).

    Ultimately, these systemic deficiencies result in significant
    psychological and financial strain for graduating students, while
    simultaneously compromising the administrative transparency, data
    integrity, and operational reputation of the institution.

**1.3 Aim and Objectives**

**Aim:** To design and implement a web-based Online Clearance Management
System that automates the student clearance process and improves
administrative efficiency at the Federal University of Lafia.

**Objectives:**

a.  To design a centralized web portal where FULafia students can
    initiate clearance requests and upload digital copies of their bank
    tellers for remote verification.

b.  To develop a multi-departmental dashboard that allows officers in
    the Library, Bursary, and Faculty units to review and approve
    clearance requests electronically.

c.  To implement a secure database management system to ensure real-time
    tracking of clearance progress and provide a digital audit trail for
    all approvals.

d.  To evaluate the performance and usability of the developed system
    among FULafia students and administrative staff using standard
    software metrics.

**1.4 Scope of the Study**

The study focuses on the undergraduate graduation clearance process at
the Federal University of Lafia. It encompasses the core administrative
units involved in the exit chain: the Bursary (financial verification),
University Library (resource returns), Student Affairs (ID card/dues),
and Academic Departments (HOD/Faculty Officer). The system will focus on
the software logic required for digital approvals and the management of
uploaded proof-of-payment documents. It excludes staff disengagement and
postgraduate clearance.

**1.5 Significance of the Study**

a.  **For Students:** It eliminates the stress of physical queuing and
    the high cost of traveling back to Lafia for graduates who have
    relocated for national service (Ardo, 2021).

b.  **For Administrative Staff:** It simplifies record-keeping, reduces
    the manual workload of checking physical files, and allows for
    simultaneous processing by different units (Ibiyomi et al., 2024).

c.  **For University Management:** It enhances transparency, prevents
    financial leakages, and provides accurate data for strategic
    decision-making (Obikoya, 2023).

d.  **For the University ICT Directorate:** The project provides a
    modernized, scalable technical infrastructure that supports seamless
    data integration across university portals, reducing technical
    redundancy and strengthening overall system security (Alenezi,
    2023).

e.  **For Future Researchers:** This study serves as a foundational
    reference and technical blueprint for scholars exploring the
    digitization of administrative workflows and the challenges of
    educational technology within the Nigerian landscape (Fakoya et al.,
    2021).

f.  **For Government Education Regulators:** It facilitates more
    efficient auditing and verification of graduation data for bodies
    such as the National Universities Commission (NUC), ensuring the
    institution remains compliant with national digital governance
    standards (Alenezi, 2023).

**1.6 Definition of Terms**

a.  **Agile Methodology:** An iterative software development approach
    that focuses on continuous feedback and flexible responses to
    changing requirements.

b.  **API (Application Programming Interface):** A set of protocols that
    allows different software components to communicate.

c.  **Bank Teller:** A physical paper document issued by a commercial
    bank as evidence of a cash deposit into the university's account.

d.  **Clearance:** The formal certification of a student\'s
    trustworthiness and fulfillment of all obligations to the university
    (Oliha, 2020).

e.  **PoP (Proof of Payment):** Any digital or physical document (e.g.,
    a scanned teller or receipt) used to prove that a financial
    obligation has been met.

f.  **RDBMS (Relational Database Management System):** Software like
    MySQL used to manage student records in structured tables.

g.  **UI/UX (User Interface/User Experience):** The visual design and
    overall usability of the system as perceived by the students and
    staff.

**1.7 Organization of Work**

The research is organized into five distinct chapters as follows:

a.  **Chapter One:** This chapter provides the general introduction,
    background to the study, statement of the problem, aim, objectives,
    scope, and the significance of the research to FULafia.

b.  **Chapter Two:** This chapter covers the literature review,
    including the conceptual and theoretical frameworks. It reviews 15+
    related works from 2020-2025, summarizes them in a table, and
    identifies the research gaps.

c.  **Chapter Three:** This chapter details the research methodology,
    analyzing both the existing manual system and the proposed new
    system. It explains the Agile methodology, high-level models, and
    technical specifications, including database design.

d.  **Chapter Four:** This chapter focuses on the system implementation,
    including the choice of programming languages, hardware/software
    requirements, and the testing phase (unit and integration testing).

e.  **Chapter Five:** The final chapter provides a summary of the
    project findings, draws conclusions, and offers recommendations for
    future research and institutional adoption at FULafia.

**CHAPTER TWO**

**LITERATURE REVIEW**

**2.1 Conceptual Review**

The concept of academic clearance has transitioned from a simple
administrative task to a critical component of institutional information
management. Conceptually, clearance is the process of proving that an
individual is \"not wanting\" in various sections of the institution,
signifying they have returned all property and cleared all debts (Oliha,
2020). Within the framework of institutional digitalization, an Online
Clearance Management System (OCMS) serves as a web-based repository that
manages the \"disengagement lifecycle\" of a student (Taiwo & Faboya,
2025).

Institutional digitalization refers to the strategic adoption of digital
technologies to improve organizational performance (Alenezi, 2023). For
FULafia, this means moving away from a fragmented system of paper files
toward a centralized digital ecosystem. Administrative efficiency is
measured by the reduction of \"friction\" in the system---decreasing the
time students spend waiting and the effort staff spend manually
verifying records (Obikoya, 2023). Conceptually, the proposed system
acts as an \"inter-departmental bridge,\" allowing data to flow
seamlessly between the Library, Bursary, and Faculty units, thereby
ensuring that a \"cleared\" status in one unit is immediately visible to
others (Eweoya et al., 2024).

**2.2 Theoretical Review**

This study is theoretically grounded in the Technology Acceptance Model
(TAM) and the Unified Theory of Acceptance and Use of Technology
(UTAUT).

TAM, developed by Davis (1989), posits that user adoption is driven by
two primary variables: Perceived Usefulness (PU) and Perceived Ease of
Use (PEOU) (Davis, 1989). In the FULafia context, if students perceive
the OCMS as a tool that eliminates the need for physical travel (PU) and
find the interface intuitive to use (PEOU), they will have a high
intention to use the system (Adamu, 2022).

To broaden this, the UTAUT model (Venkatesh et al., 2003) is applied to
explain the institutional adoption by staff. UTAUT identifies four core
constructs:

a.  **Performance Expectancy:** The degree to which staff believe the
    system will help them perform their jobs more efficiently (e.g.,
    faster teller verification).

b.  **Effort Expectancy:** The ease with which staff can learn to
    navigate the clearance dashboard.

c.  **Social Influence:** The degree to which the university management
    and peers encourage the use of the new digital system.

d.  **Facilitating Conditions:** The existence of the necessary
    technical infrastructure at FULafia (internet, electricity, and
    training) to support the system (Venkatesh et al., 2003).

By combining these theories, the research addresses both the individual
motivation of the students and the institutional readiness of the staff
(Adamu, 2022).

**2.3 Review of Related Works**

**Taiwo and Faboya (2025):** These researchers developed a
\"mobile-first\" automated final year clearance system using Flutter for
the frontend and Firebase/MySQL for the backend. Their work highlights
that since most Nigerian students access the internet via mobile
devices, the interface must be responsive. The study showed a 40%
reduction in physical office visits (Taiwo & Faboya, 2025).

**Ibiyomi, Ajinaja, and Akeem (2024):** This study focused on an
Electronic Administration (E-Admin) system specifically for Registry
Units. They emphasized that centralizing student records into a digital
platform minimizes human errors during the verification of credentials
and speeds up the issuance of final clearance certificates (Ibiyomi et
al., 2024).

**Ekoro and Bassey (2024):** They proposed a \"Robust Web-based
Clearance System\" for Colleges of Education. Their key contribution was
the introduction of \"sessional clearance,\" which allows students to be
cleared annually. This prevents the traditional \"last-minute rush\"
that occurs at graduation (Ekoro & Bassey, 2024).

**Eweoya, Agbeyangi, and Lukose (2024):** This research implemented a
solution using ReactJS and ExpressJS, focusing on real-time status
tracking. Their findings showed that providing students with a
\"progress bar\" significantly reduced psychological stress and the
frequency of \"check-in\" visits to offices (Eweoya et al., 2024).

**Awofolaju et al. (2023):** Developed a departmental clearance system
using Python for the backend. They argued that Python-based servers
offer better security and scalability for handling high volumes of
student data compared to traditional PHP implementations (Awofolaju et
al., 2023).

**Adamu (2022):** Conducted a comprehensive usability evaluation of an
online clearance system at IBB University. Using a sample of 200
respondents, the study found a 95.3% approval rating for accessibility,
confirming that web-based systems are highly favored by the academic
community (Adamu, 2022).

**Jibril and Umar (2021):** Investigated the integration of biometric
fingerprint authentication into student services. Their research
emphasized that while online portals solve the distance problem,
biometrics are needed to prevent impersonation and the use of forged IDs
during final certificate collection (Jibril & Umar, 2021).

**Murtala (2022)**: Applied the Structured System Analysis and Design
Methodology (SSADM) to build a platform-independent clearance
application. His work ensured that the system functioned identically
across Android, Windows, and Linux environments (Murtala, 2022).

**Ibrahim and Sulaimon (2021):** Utilized the Waterfall Model to build a
departmental system for Osun State University. They focused on
\"integrity controls\" at the login phase to ensure that only authorized
students with valid matriculation numbers could access the portal
(Ibrahim & Sulaimon, 2021).

**Essel et al. (2023):** Explored institutional digital resilience
post-COVID-19. They found that universities that already had online
portals for registration and clearance were able to maintain graduation
timelines despite campus lockdowns (Essel et al., 2023).

**Mangubat et al. (2023):** Applied statistical record tagging to
improve data accuracy in student management systems. This ensured that
different statuses (e.g., \"Indebted\" vs. \"Pending\") were clearly
demarcated in the database to prevent automated rejection of students
(Mangubat et al., 2023).

**Obikoya (2023):** In a doctoral study at Mountain Top University,
Obikoya analyzed how online systems act as strategic platforms for
university management, providing real-time data on how long it takes for
a student to be cleared at each unit (Obikoya, 2023).

**Ramadhan et al. (2020):** Proposed an open-source, web-based clearance
architecture for Iraqi HEIs. Their work prioritized Role-Based Access
Control (RBAC), ensuring that a staff member in the Library could not
alter financial data in the Bursary module (Ramadhan et al., 2020).

**Fakoya et al. (2021):** Integrated an SMS notification system into the
clearance workflow. This proactive communication ensured students
received immediate alerts on their phones if their clearance was
rejected, allowing them to fix issues instantly (Fakoya et al., 2021).

**Ardo (2021):** Focused on moving the \"queuing system\" into a digital
environment. He argued that the internet removes physical office walls,
allowing students to \"queue\" for signatures from their bedrooms,
thereby eliminating office congestion (Ardo, 2021).

**2.4 Summary of Reviewed Literature**

To provide a structured overview of the current research landscape and
to facilitate a direct comparison between various technological
approaches, the key attributes of the studies analyzed in this chapter
have been synthesized. *Table 1* presents a comprehensive summary of the
reviewed literature, detailing the specific methodologies, development
tools, and research outcomes of various scholars while highlighting the
persistent limitations that justify the need for the proposed system at
FULafia.

Table 1: Summary of Literature Reviewed

  ------------------------------------------------------------------------------------------------------------
  **Author**   **Year**   **Title**        **Method**       **Tools**       **Findings**     **Limitation**
  ------------ ---------- ---------------- ---------------- --------------- ---------------- -----------------
  Taiwo &      2025       Automated Final  Cross-Platform   Flutter/MySQL   40% reduction in High data
  Faboya                  Year OCMS        Dev.                             visits.          consumption.

  Ibiyomi et   2024       E-Admin for      Centralized      PHP/MySQL       Reduced registry Limited mobile
  al.                     Registry Units   Archiving                        errors.          responsiveness.

  Ekoro &      2024       Robust Web-based Incremental      Java/XAMPP      Prevents         Local server
  Bassey                  System           Model                            last-minute      constraints.
                                                                            rush.            

  Adamu        2022       Online Clearance Descriptive      PHP/MySQL       95.3%            Older UI/UX
                          System           Survey                           accessibility    design.
                                                                            rating.          

  Jibril &     2021       Biometric        Fingerprint ID   Biometric       Eliminated       High hardware
  Umar                    Clearance                         Reader          impersonation.   costs.

  Eweoya et    2024       Streamlining     Real-time        React/Express   Improved user    No offline file
  al.                     Clearance        Tracking                         satisfaction.    caching.

  Awofolaju et 2023       Automated Dept.  Waterfall Model  Python/MySQL    High server      Focused only on
  al.                     Clearance                                         scalability.     departments.

  Murtala      2022       Web-Based        SSADM            HTML/PHP/SQL    Platform         No automated
                          Clearance System                                  independence.    notifications.

  Ibrahim &    2021       Automated Dept.  Waterfall Model  Python/MySQL    Strong integrity Sequential
  Sulaimon                Clearance                                         controls.        processing only.

  Essel et al. 2023       Digital          Case Study       Web Portals     Maintained       Requires stable
                          Resilience in    Review                           academic         electricity.
                          HEIs                                              calendar.        

  Mangubat et  2023       Student          Statistical      TnT Tagger      Enhanced record  Complex
  al.                     Clearance Mgmt   Tagging                          accuracy.        implementation.

  Obikoya      2023       Online Student   Doctoral         Web Forms       Data-driven      Focused on
                          Clearance        Research                         management.      private
                                                                                             university.

  Ramadhan     2020       Open-Source Web  Modular Design   PHP/MySQL       Secure role      Limited
                          Clearance                                         separation.      scalability for
                                                                                             large units.

  Fakoya et    2021       SMS Notification Extreme          SMS Gateway     Instant student  SMS subscription
  al.                     System           Programming                      updates.         costs.

  Ardo         2021       Internet-Based   System           Web-Based       Reduced office   No payment
                          Queuing          Automation                       congestion.      verification.
  ------------------------------------------------------------------------------------------------------------

**2.5 Research Gaps and Justification**

The literature review reveals that while many systems integrate with
automated payment APIs (like Remita), they do not account for the manual
\"Bank Teller\" system prevalent at FULafia. Most existing systems
assume a fully digital financial infrastructure. This project fills this
gap by designing a system specifically for FULafia that allows for the
Digital Upload of Scanned Bank Tellers, enabling the Bursary to verify
physical deposits without the student needing to be physically present
at the window.

**\
**

**CHAPTER THREE**

**RESEARCH METHODOLOGY**

**3.1 Analysis of the Existing System**

The existing student clearance process at the Federal University of
Lafia is a manual, decentralized, and paperwork-intensive workflow.
Students must physically obtain a clearance form and visit approximately
12 different administrative units in a sequential order (FULafia, 2020;
Adamu, 2022).

a.  **The Financial Phase:** At FULafia, students make payments at
    commercial banks and receive a physical paper teller. They must then
    take this teller to the Bursary to have it verified and stamped as
    proof of payment (PoP).

b.  **The Verification Phase:** Students visit the University Library to
    prove no books are outstanding, the Student Affairs for ID card
    return, and the Faculty and Departmental offices for academic
    sign-offs. At each stage, an administrative officer must manually
    check physical files or standalone spreadsheets before signing and
    stamping the paper clearance form.

**3.1.1 Advantages of the Existing System**

a.  **Robustness During Outages:** The manual system does not rely on
    the university\'s internet infrastructure or electricity, allowing
    signatures to be collected even during downtime.

b.  **Direct Interaction:** It allows for face-to-face resolution of
    complex issues, such as clarifying a missing academic record
    directly with a Level Adviser or HOD.

**3.1.2 Disadvantages of the Existing System**

a.  **Administrative Fatigue:** Staff are burdened with thousands of
    physical files, leading to a high probability of manual entry errors
    and slow processing times (Ibiyomi et al., 2024).

b.  **Physical and Financial Stress:** Graduating students who have
    relocated must travel back to Lafia, incurring high transportation
    and accommodation costs for a process that can take weeks (Ardo,
    2021).

c.  **Vulnerability to Loss and Damage:** Paper bank tellers and
    clearance forms are easily lost or damaged. If a student loses their
    stamped teller, the Bursary often requires a time-consuming bank
    reconciliation process.

d.  **Ineffective Monitoring:** There is no way for a student or
    management to track the overall progress of a clearance request
    until the physical form is fully completed.

**3.2 Analysis of the New System**

The proposed Online Clearance Management System (OCMS) is a centralized
web application designed to move the entire FULafia clearance chain into
a secure digital environment.

a.  **Digital Submission:** Instead of walking to the Bursary, students
    scan and upload their bank tellers and receipts directly to the
    portal.

b.  **Concurrent Review:** The system allows multiple departments to
    review a student\'s status simultaneously. For example, the Library
    can clear a student while the Bursary is still verifying their
    uploaded teller, significantly reducing the total turnaround time
    (Eweoya et al., 2024).

**3.2.1 Justification for the New System**

The transition to the OCMS is justified by its ability to provide
Borderless Access. It specifically solves the FULafia manual payment
problem by allowing Bursary staff to view uploaded teller images and
verify them against bank statements from their own digital dashboard.
This eliminates the \"queuing cycle\" and ensures that students receive
instant status updates via the portal, increasing transparency and
institutional accountability (Obikoya, 2023).

**3.3 Methodology Adopted**

This project adopts the Agile Software Development Methodology for the
design and implementation of the Online Clearance Management System. In
selecting this approach, a strategic comparison was made with the
traditional Waterfall Model. The Waterfall model follows a linear and
sequential path where each phase requirements, design, implementation,
and testing must be completed before the next begins, making it highly
rigid and difficult to adapt to changes once development has commenced
(Awofolaju et al., 2023; Ibrahim & Sulaimon, 2021).

In contrast, the Agile methodology is iterative and incremental,
allowing for continuous refinement and the accommodation of new
requirements as they emerge during the development lifecycle (Essel et
al., 2023). Given the complex, multi-departmental nature of the FULafia
clearance process where different units like the Bursary and Library may
have unique, evolving administrative rules, the flexibility of Agile was
deemed superior to the sequential constraints of the Waterfall approach
(Eweoya et al., 2024).

**Why Agile?**

a.  **Flexibility:** It allows the developer to accommodate the
    specific, often changing, requirements of different FULafia units
    (e.g., specific departmental dues).

b.  **Speed to Value:** It focuses on delivering a \"Minimum Viable
    Product\" (MVP)---such as the Bursary module---quickly to test its
    effectiveness before building the entire suite.

c.  **User Involvement:** By following Agile Sprints, we can demonstrate
    the system to Faculty Officers and HODs, ensuring that the software
    matches their actual administrative workflows (Agile Manifesto,
    2001; Eweoya et al., 2024).

**3.4 High-Level Model**

To visualize the system architecture and its functional requirements,
three primary models are utilized:

**3.4.1 Block Diagram**

To provide a clear conceptual understanding of the system\'s modular
structure, a high-level model was developed. As illustrated in *Figure
1*, the block diagram provides a high-level view of the system\'s
components, showing the User Interface (Web Client) communicating with
the Application Server, which in turn queries the Central Database
(MySQL). This visual highlights the seamless flow of data from the
student\'s device to the various administrative dashboards.

![block Diagram](media/image1.png){width="6.014583333333333in"
height="3.265277777777778in"}

Figure 1: Block Diagram of the New System

**3.4.2 Architecture Diagram**

The technical framework of the proposed solution is built upon a
standard modularized approach to ensure both security and scalability.
*Figure 2* represents the system architecture, demonstrating how the
system utilizes a Three-Tier Architecture to separate the presentation
layer, the business logic, and the data storage for efficient processing
of clearance requests.

a.  **Presentation Layer (Frontend):** Developed with HTML5, CSS3, and
    JavaScript (using React or VueJS) to ensure responsiveness on mobile
    phones and desktops (Taiwo & Faboya, 2025).

b.  **Application Layer (Backend):** Built with Python (Django) or PHP
    (Laravel). This layer contains the \"Business Logic,\" such as
    verifying the validity of an uploaded teller and routing clearance
    requests to the correct HOD (Awofolaju et al., 2023).

c.  **Data Layer (Database):** A MySQL relational database stores
    encrypted user credentials, student liability records, and uploaded
    document paths.

    ![Architecture](media/image2.png){width="4.778472222222222in"
    height="4.659027777777778in"}

    Figure 2: Architectural Diagram of the New System

**3.4.3 Use Case Diagram**

To define the functional boundaries and the roles of the different users
involved in the FULafia clearance process, a UML model was designed. As
shown in *Figure 3*, the Use Case Diagram identifies the primary
\"Actors\" including Students, Departmental Officers, and Administrators
and maps their specific interactions with the system\'s core features.

a.  **Student Actor:** Logins, uploads tellers, checks clearance status,
    and downloads the final clearance certificate.

b.  **Administrative Officer Actor (Bursary/Library):** Logins, views
    uploaded proof-of-payment, approves/rejects requests with comments.

c.  **System Admin Actor:** Manages user accounts, resets passwords, and
    generates statistical reports on departmental performance.

    ![useCase](media/image3.png){width="5.903472222222222in"
    height="5.7756944444444445in"}

    Figure 3: Use Case Diagram of the New System

**3.5 Specifications**

The system\'s technical foundation is defined by detailed specifications
to ensure data integrity and operational reliability.

**3.5.1 Program Module Specification**

The system is divided into three core modules:

a.  **Student Module:** Features include Profile Management, Document
    Upload (Tellers/Receipts), and Status Tracking.

b.  **Departmental Module:** Features include a Pending Requests
    Dashboard, Verification Tool (viewing uploads), and an
    Approval/Rejection Interface.

c.  **Admin Module:** Includes University-wide settings, Departmental
    Role Management, and Audit Log viewing.

**3.5.2 Database Design (ER Diagram)**

The database is the heart of the OCMS. An Entity-Relationship Diagram
(ERD) is used to model the relationships, as illustrated in Figure 4.
Key entities include:

a.  **Student Entity:** Attributes include Matric_No (Primary Key),
    Name, Department, and Level.

b.  **Clearance_Request Entity:** Links students to departments with
    attributes like Request_ID, Status (Pending/Cleared/Rejected), and
    Date_Submitted.

c.  **Payment_Upload Entity:** Stores paths to uploaded teller images,
    linked to the student and a specific fee type (e.g., Alumni Dues).

d.  **Staff Entity:** Stores login credentials and departmental roles
    (e.g., \"Library_Admin\").

![ERD](media/image4.png){width="3.5944444444444446in"
height="2.759027777777778in"}

Figure 4: ER Diagram of the New System

**3.5.3 Input/Output Design**

a.  **Input Design:** User-friendly forms for student login,
    matriculation number entry, and a file-picker for uploading scanned
    bank tellers.

b.  **Output Design:** A real-time status dashboard for students and a
    downloadable, digitally-signed Clearance Certificate (PDF) once all
    departments have granted approval.

**3.5.4 Data Dictionary**

This defines the structure of every data field in the system:

a.  **Matric_No:** Unique string, 20 characters, Primary Key.

b.  **Clearance_Status:** Boolean or Enum (0=Pending, 1=Cleared,
    2=Rejected).

c.  **Upload_Timestamp:** DateTime, records exactly when a teller was
    submitted.

**3.5.5 Algorithm (Pseudocode)**

The core logic for the clearance workflow is as follows:

IF User_Login(Username, Password) == Valid:

IF Student_Actor:

DISPLAY Status_Dashboard

IF Apply_For_Clearance:

UPLOAD(Bank_Teller_Image)

SET Department_Status = \"PENDING\"

ELSE IF Admin_Officer:

DISPLAY Pending_Requests_Queue

IF Action == \"APPROVE\":

SET Student_Clearance_Status = \"CLEARED\"

ELSE:

PROMPT for Rejection_Reason

**3.6 System Flowchart**

The logical sequence and decision-making paths of the software are
mapped out to ensure a smooth and error-free user journey. *Figure 5*
presents the system flowchart, which provides a step-by-step procedural
statement of the clearance lifecycle, starting from the initial student
login and bank-teller upload to the final approval and generation of the
digital certificate.

![flowchart](media/image5.png){width="4.560416666666667in"
height="6.43125in"}

Figure 5: New System Flowchart

# REFERENCES

1.  Adamu, A. (2022). Online clearance system. *FUDMA Journal of
    Sciences (FJS)*, 6(2), 2645-2944.
    https://www.researchgate.net/publication/370757433_ONLINE_CLEARANCE_SYSTEM

2.  Ardo, G. V. (2021). Design and implementation of an internet-based
    clearance system to facilitate the queuing system. *Project
    Materials*. https://nairaproject.com/projects/3731.html

3.  Awofolaju, O. M., et al. (2023). Automated departmental clearance
    system for Nigerian universities. *ResearchGate*.
    https://www.researchgate.net/publication/394431486_Streamlining_Student_Clearance_in_Higher_Education_A\_Web-based_Solution

4.  Davis, F. D. (1989). Perceived usefulness, perceived ease of use,
    and user acceptance of information technology. *MIS Quarterly*,
    13(3), 319-340. https://pmc.ncbi.nlm.nih.gov/articles/PMC2814963/

5.  Ekoro, E. I., & Bassey, I. R. (2024). Design and implementation of a
    robust web-based clearance system for students in Nigerian colleges
    of education. *British Journal of Computer, Networking and
    Information Technology (BJCNIT)*, 7(2), 86-96.
    https://abjournals.org/bjcnit/papers/volume-7/issue-2/design-and-implementation-of-a-robust-web-based-clearance-system-for-students-in-nigeria-colleges-of-education/

6.  Essel, H. B., et al. (2023). Post-pandemic digital adaptation and
    institutional resilience in higher education. *IRE Journals*, 9(3).
    https://www.irejournals.com/formatedpaper/1710410.pdf

7.  Eweoya, I. O., Agbeyangi, A. O., & Lukose, J. M. (2024).
    Streamlining student clearance in higher education: A web-based
    solution. *ResearchGate*.
    https://www.researchgate.net/publication/394431486_Streamlining_Student_Clearance_in_Higher_Education_A\_Web-based_Solution

8.  Fakoya, J. T., Ajinaja, M. Q., Olaseide, O. O., & Johnson, O. V.
    (2021). Developed a web-based SMS notification clearance system
    using extreme programming (XP) methodology. *ResearchGate*.
    https://www.researchgate.net/publication/358880863_Design_and_Implementation_of_a\_Web-Based_Sms-Notification_Clearance_System

9.  Federal University of Lafia. (2025). Registration guidelines for
    fresh students 2024/2025 session. *FULafia Portal*.
    https://my.fulafia.edu.ng/api/default-document/get-document?programme_type=2&name=registration_procedure

10. Ibiyomi, M. Q., Ajinaja, M. Q., & Akeem, A. (2024). Electronic
    administration (E-Admin) system for registry unit automation.
    *Academic Journal of Engineering and Sciences*.
    https://ajesjournal.org/index.php/ajes/article/view/4251/7636

11. Ibrahim, M. S., & Sulaimon, N. A. (2021). Design and implementation
    of an automated departmental clearance system. *Impact International
    Journals*.
    https://impactinternationaljournals.com/wp-content/uploads/2025/10/AN-ONLINE-RESULT-CLEARANCE-SYSTEM-ORCS-A-CASE-OF-FEDERAL-COLLEGE-OF-EDUCATION-PANKSHIN.pdf

12. Jibril, M., & Umar, A. (2021). Biometric fingerprint-based approach
    for examination and graduation clearance. *ResearchGate*.
    https://www.researchgate.net/publication/338120140_Fingerprint_Based_Approach_For_Examination_Clearance_in_Higher_Institutions

13. Mangubat, J. M. L., et al. (2023). Online student clearance
    management system using statistical record tagging. *International
    Journal of Scientific & Academic IT*.
    https://www.warse.org/IJSAIT/static/pdf/file/ijsait011252023.pdf

14. Murtala, J. (2022). Web-based clearance system: A technical approach
    for analyzing and designing an application. *Caritas University
    Engineering and Technology Journal*.
    https://caritasuniversityjournals.org/index.php/cjet/article/view/192

15. Obikoya, O. (2023). Design and implementation of online student
    clearance system. (Doctoral dissertation, Mountain Top University).
    https://www.irejournals.com/formatedpaper/1710410.pdf

16. Oliha, J. (2020). Clearance as a certificate of disengagement: A
    system review. *FUDMA Journal of Sciences*.
    https://fjs.fudutsinma.edu.ng/index.php/fjs/article/view/1756

17. Ramadhan, A., et al. (2020). Open-source web-based clearance system
    for higher education institutions. *ResearchGate*.
    https://www.researchgate.net/publication/394431486_Streamlining_Student_Clearance_in_Higher_Education_A\_Web-based_Solution

18. Taiwo, O., & Faboya, O. T. (2025). Automated final year online
    clearance system: A case study of a university. *Iconic Research and
    Engineering Journals (IRE Journals)*, 9(3), 318-326.
    https://www.irejournals.com/paper-details/1710410

19. Venkatesh, V., Morris, M. G., Davis, G. B., & Davis, F. D. (2003).
    User acceptance of information technology: Toward a unified view.
    *MIS Quarterly*, 27(3), 425-478.
    https://www.jite.org/documents/Vol23/JITE-Rv23Art017Kittinger9923.pdf
