export type ArchitectureNode = {
  id: string;
  column: number;
  row: number;
  label: string;
  technology: string;
  detail: string;
  kind: 'client' | 'service' | 'data' | 'external';
};

export type ArchitectureEdge = {
  from: string;
  to: string;
  label: string;
  kind?: 'async' | 'external';
};

export type ProjectSource = {
  title: string;
  locator: string;
  kind: 'Report' | 'Repository' | 'Chrome Web Store';
  href?: string;
};

export type Project = {
  n: string;
  slug: string;
  title: string;
  categories: string[];
  tag: string;
  type: string;
  image: string;
  stack: string[];
  desc: string;
  headline: string;
  accent: string;
  context: string;
  contribution: string;
  challenge: string;
  delivery: string;
  capabilities: { title: string; text: string }[];
  decisions: { title: string; text: string }[];
  scopeNote: string;
  architecture: {
    title: string;
    caption: string;
    lanes: string[];
    nodes: ArchitectureNode[];
    edges: ArchitectureEdge[];
  };
  sources: ProjectSource[];
};

const component = (id: string, column: number, row: number, label: string, technology: string, detail: string, kind: ArchitectureNode['kind'] = 'service'): ArchitectureNode => ({ id, column, row, label, technology, detail, kind });
const link = (from: string, to: string, label: string, kind?: ArchitectureEdge['kind']): ArchitectureEdge => ({ from, to, label, kind });
const repository = (repo: string, locator: string, title = 'Source repository'): ProjectSource => ({ title, locator, kind: 'Repository', href: `https://github.com/${repo}` });
const report = (title: string, locator: string): ProjectSource => ({ title, locator, kind: 'Report' });

export const PROJECTS: Project[] = [
  {
    n: '01', slug: 'inforisk', title: 'Inforisk / Financial Intelligence', categories: ['Web applications', 'Mobile applications'], tag: 'PFE · Web & mobile', type: 'atlas', image: '/assets/projects/inforisk.png', accent: '#567ce5',
    stack: ['Flutter', 'Dart', 'Spring Boot', 'PostgreSQL'],
    desc: 'A consumer credit-report platform connecting Flutter web and mobile interfaces to report access, subscriptions, sharing, and support workflows.',
    headline: 'Financial information.\nA clearer way in.',
    context: 'Final-year internship · INFORISK',
    contribution: 'Flutter web and mobile interfaces, business journeys, and contributions to the Spring Boot backend, persistence, integrations, and functional validation. The consumer platform integrates the organization’s existing shared services.',
    challenge: 'A credit report is sensitive information. Presenting it clearly is only part of the job: access also depends on the person or company profile, ownership, consent, subscription entitlements, and quotas.',
    delivery: 'A consumer platform that brings report consultation, controlled sharing, subscriptions, alerts, disputes, and support into connected web and mobile journeys.',
    capabilities: [
      { title: 'One product, two surfaces', text: 'Flutter interfaces adapted for web and mobile, with shared models, providers, reusable widgets, and API services.' },
      { title: 'Access with business rules', text: 'Local token-backed sessions combined with ownership checks, PP/PM profiles, subscription rights, quotas, and report-sharing authorization.' },
      { title: 'Reports beyond a PDF', text: 'Structured JSON report views and downloadable PDFs supplied through the organization’s existing report services.' },
    ],
    decisions: [
      { title: 'Separate the product from shared infrastructure', text: 'The consumer backend brings existing report, support, and alert services into a single product experience. This keeps the consumer journeys separate from the organization’s upstream ingestion, scoring, and PDF generation systems.' },
      { title: 'Model access at the resource level', text: 'Authorization combines session validity with ownership, consent, subscription rights, and quotas. Access is evaluated against the requested resource and the user’s business context.' },
      { title: 'Make delivery boundaries visible', text: 'The implemented payment journey is a simulation. External CMI payments and ADD/IAM federation are identified as future integrations.' },
    ],
    scopeNote: 'Implemented consumer-platform scope from the PFE report. CMI payment integration and ADD/IAM federation are future work; no claim of ownership over shared ingestion, scoring, or PDF services.',
    architecture: {
      title: 'The product boundary matters.', caption: 'Consumer-platform integration view, redrawn from the PFE report, §§4.2–4.3 and §4.7. External nodes belong to shared organizational systems.', lanes: ['Experience', 'Consumer platform', 'Persistence & integrations', 'Shared services'],
      nodes: [
        component('web', 0, 0, 'Web experience', 'Flutter · Dart', 'Responsive consumer interfaces built with Flutter for the web.', 'client'),
        component('mobile', 0, 2, 'Mobile experience', 'Flutter · Dart', 'The mobile interface uses the same frontend technology and dedicated API services.', 'client'),
        component('api', 1, 1, 'Consumer backend', 'Spring Boot · REST', 'Controllers, business services, repositories, and integration components handle sessions, subscriptions, access, and sharing.'),
        component('db', 2, 0, 'Application data', 'PostgreSQL', 'Stores consumer-platform data including accounts, sessions, subscriptions, and access-related records.', 'data'),
        component('files', 2, 2, 'File storage', 'Local filesystem', 'Stores application files on the local filesystem.', 'data'),
        component('report', 3, 0, 'Credit-report service', 'Shared · JSON / PDF', 'An external report service provides structured reports and coordinates the PDF and scoring chain.', 'external'),
        component('support', 3, 1, 'Support backend', 'Shared service', 'Consumer support workflows integrate the organization’s existing support backend.', 'external'),
        component('alerts', 3, 2, 'Infomarket & alerts', 'Shared services', 'External data and event-detection services support report information and subscription-linked alerts.', 'external'),
      ], edges: [link('web', 'api', 'REST'), link('mobile', 'api', 'REST'), link('api', 'db', 'Persistence'), link('api', 'files', 'Files'), link('api', 'report', 'Reports', 'external'), link('api', 'support', 'Support', 'external'), link('api', 'alerts', 'Integration', 'external')],
    },
    sources: [report('MY_PFE_REPORT_ZAKARIA_OUMGHAR.pdf', '§1.4.3, pp. 9–10: contribution; §§4.2–4.3, pp. 36–38: architecture; §§4.7–4.8, pp. 45–46: integrations and boundaries')],
  },
  {
    n: '02', slug: 'ourbusway', title: 'OurBusWay', categories: ['Web applications'], tag: 'Team project · Microservices', type: 'nova', image: '/assets/projects/ourbusway.png', accent: '#80bba5',
    stack: ['Spring Boot', 'Spring Cloud', 'React', 'PostgreSQL', 'RabbitMQ', 'Consul', 'Docker'],
    desc: 'Urban transport workflows across eight business services: ticketing, subscriptions, routes, location, payments, incidents, notifications, and users.',
    headline: 'A city in motion.\nA system behind it.', context: 'ENSIAS · SOA / Microservices project',
    contribution: 'Engineering contributor to this four-person ENSIAS project, alongside Meryem Elfadili, Hiba El Ouerkhaoui, and Abderrahmane Essahih. The platform and architecture presented here are a shared team deliverable.',
    challenge: 'Passenger purchases, driver operations, ticket inspections, and administrator oversight have different needs. They still have to agree on the same journey, payment, and transport entitlement.',
    delivery: 'A transport platform combining role-specific interfaces with domain-based services, secure REST APIs, asynchronous communication, and containerized deployment.',
    capabilities: [
      { title: 'The whole passenger journey', text: 'Route discovery, ticket purchasing, QR-code and PDF transport titles, subscriptions, and bus-location views.' },
      { title: 'Operations for each role', text: 'Separate workflows for passengers, drivers, controllers, and administrators, including inspections and incident handling.' },
      { title: 'Distributed business domains', text: 'Eight business services, a Spring Cloud Gateway entry point, Consul discovery, PostgreSQL persistence, and RabbitMQ messaging.' },
    ],
    decisions: [
      { title: 'Use the transport domains as boundaries', text: 'Ticketing, subscriptions, payment, and operations are represented as separate services. Each service owns its data and exposes its business operations through APIs.' },
      { title: 'Connect synchronous and asynchronous work', text: 'REST APIs handle direct requests; RabbitMQ provides the asynchronous communication layer. Together they support immediate user actions and background communication between the transport domains.' },
      { title: 'Bring the environment with the system', text: 'Docker Compose coordinates the services and supporting infrastructure. The cloud deployment combines AWS virtual-machine hosting with RDS PostgreSQL.' },
    ],
    scopeNote: 'Team deliverable. The system map groups the eight documented business services; broker-to-service routing details are intentionally omitted where the report does not specify them.',
    architecture: {
      title: 'One journey. Several business domains.', caption: 'Logical view from rapport_ourbusway.pdf, chapter 3 and §4.8. Service groups are presentation groupings, not additional deployed services.', lanes: ['Clients', 'Entry & discovery', 'Business services', 'Data & messaging'],
      nodes: [
        component('ui', 0, 1, 'Role-based interfaces', 'React', 'Passenger, driver, controller, and administrator interfaces use the backend through its API entry point.', 'client'),
        component('gateway', 1, 0, 'API Gateway', 'Spring Cloud Gateway', 'Single entry point for routing client requests into the transport services.'),
        component('discovery', 1, 2, 'Service discovery', 'Consul', 'Registers services and supports discovery and health monitoring.'),
        component('commerce', 2, 0, 'Tickets · passes · payment', '3 Spring Boot services', 'Ticket, Subscription, and Payment services handle transport entitlements and payment processing, including Stripe webhook handling.'),
        component('operations', 2, 1, 'Trips · GPS · incidents', '3 Spring Boot services', 'Trip, Geolocation, and Incident services cover route information, bus positions, and operational events.'),
        component('users', 2, 2, 'Users · notifications', '2 Spring Boot services', 'User and Notification services manage accounts, roles, and passenger communications.'),
        component('data', 3, 0, 'Service-owned data', 'PostgreSQL', 'Each business service has its own PostgreSQL data store.', 'data'),
        component('broker', 3, 2, 'Event messaging', 'RabbitMQ', 'Asynchronous messaging infrastructure for the transport platform.', 'data'),
      ], edges: [link('ui', 'gateway', 'REST'), link('gateway', 'commerce', 'Routes'), link('gateway', 'operations', 'Routes'), link('gateway', 'users', 'Routes'), link('discovery', 'gateway', 'Discovery'), link('commerce', 'data', 'Own data'), link('operations', 'data', 'Own data'), link('users', 'data', 'Own data')],
    },
    sources: [report('rapport_ourbusway.pdf', 'Chapter 3, pp. 17–24: services, APIs, and stack; §4.8, pp. 40–44: deployment and repository organization')],
  },
  {
    n: '03', slug: 'pipelinex', title: 'PipelineX', categories: ['Web applications'], tag: 'Team project · DevSecOps', type: 'atlas', image: '/assets/projects/PFA_3A.png', accent: '#aca0fa',
    stack: ['FastAPI', 'Angular', 'Celery', 'Redis', 'Docker', 'Semgrep', 'Trivy', 'OWASP ZAP'],
    desc: 'A DevSecOps pipeline engine that admits untrusted projects, queues execution, runs isolated jobs, and consolidates build, test, and security reports.',
    headline: 'Untrusted code.\nControlled execution.', context: 'ENSIAS · SecureDevOps end-of-year team project',
    contribution: 'Engineering contributor to SecureDevOps, alongside Meryem Elfadili, Hiba El Ouerkhaoui, and Abderrahmane Essahih. The engine, orchestration, and execution model presented here are the team’s shared work.',
    challenge: 'A submitted repository can be malformed, expensive to execute, or hostile. A pipeline platform needs admission controls, isolated execution, and a responsive interface before its scan results are useful.',
    delivery: 'An asynchronous pipeline platform with job-specific workspaces, container runners, selectable analysis stages, execution logs, and consolidated security findings.',
    capabilities: [
      { title: 'Validate before execution', text: 'Classifies project submissions as accepted, accepted with issues, or refused after structure and input-safety checks.' },
      { title: 'Run work away from the API', text: 'FastAPI accepts submissions while Redis and Celery coordinate background execution in dedicated Docker runners.' },
      { title: 'Security across the pipeline', text: 'Gitleaks for secrets, Semgrep for static analysis, Trivy for dependencies and containers, and OWASP ZAP for dynamic testing.' },
    ],
    decisions: [
      { title: 'Treat admission as a security boundary', text: 'Input validation precedes queueing. Admission checks cover archive traversal, decompression bombs, disallowed binaries, and project structure limits.' },
      { title: 'Separate orchestration from execution', text: 'An orchestrator prepares each workspace and triggers workers. Runner images contain the required toolchains, while modular shell scripts express the selected stages.' },
      { title: 'Keep results inspectable', text: 'Per-job filesystem storage holds logs, analysis outputs, metadata.json, and state.json. This keeps execution state and generated artifacts organized around each job.' },
    ],
    scopeNote: 'PipelineX is the portfolio name for the documented SecureDevOps project. Container isolation and input checks reduce a defined set of risks; they are not a claim of complete security or production certification.',
    architecture: {
      title: 'Admission. Queue. Isolate. Inspect.', caption: 'Execution view from main (4).pdf, §§8.1–8.3 and §11, cross-checked against the shared SecureDevOps repository.', lanes: ['Submission', 'Control plane', 'Execution', 'Artifacts'],
      nodes: [
        component('ui', 0, 1, 'Pipeline console', 'Angular', 'Submits projects and exposes job status, logs, and analysis results.', 'client'),
        component('api', 1, 0, 'Admission & orchestration', 'FastAPI', 'Validates input, creates job metadata and workspaces, and queues accepted executions.'),
        component('queue', 1, 2, 'Job queue', 'Redis', 'Buffers asynchronous execution requests for Celery workers.', 'data'),
        component('worker', 2, 0, 'Execution worker', 'Celery', 'Consumes queued jobs and manages stage order, state, and job execution lifecycle.'),
        component('runner', 2, 2, 'Isolated runner', 'Docker · shell stages', 'A dedicated container executes framework-specific build, test, and analysis scripts. Optional DAST runs in a private job network.'),
        component('reports', 3, 0, 'Logs & reports', 'Per-job filesystem', 'Stores stage outputs and normalized reports organized by job.', 'data'),
        component('state', 3, 2, 'Job metadata & state', 'JSON', 'metadata.json and state.json support execution tracking and report aggregation.', 'data'),
      ], edges: [link('ui', 'api', 'REST'), link('api', 'queue', 'Enqueue', 'async'), link('queue', 'worker', 'Dispatch', 'async'), link('worker', 'runner', 'Execute'), link('runner', 'reports', 'Stage output'), link('worker', 'state', 'State'), link('api', 'reports', 'Read results')],
    },
    sources: [report('main (4).pdf · SecureDevOps report', '§8.1–8.3, pp. 16–18: execution architecture; §11, pp. 31–35: actual stack and security tools'), repository('SecureDevOps-pfa/SecureDevOps', 'README: admission states, isolation model, supported inputs, and pipeline stages')],
  },
  {
    n: '04', slug: 'serviq', title: 'ServiQ', categories: ['Web applications'], tag: 'Internship · Industrial services', type: 'nova', image: '/assets/projects/STAGE_2A.png', accent: '#58b8cc',
    stack: ['Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'NGINX', 'OCI'],
    desc: 'An industrial services platform connecting client requests, technical execution, management oversight, and evaluations through role-specific workflows.',
    headline: 'Industrial work.\nVisible from request to delivery.', context: 'Second-year internship · Univers Gharb de la Prestation',
    contribution: 'Design and development of the UGP services-management platform, covering UI/UX, React and TypeScript interfaces, Spring Boot services, and cloud deployment.',
    challenge: 'Clients, technical leads, and managers need a shared view of industrial orders while retaining distinct permissions, approval steps, and responsibilities.',
    delivery: 'A multi-role application for service orders, project progress, quotation oversight, feedback, and management analytics, backed by containerized Spring Boot services.',
    capabilities: [
      { title: 'Three working perspectives', text: 'Client, technical-responsible, and manager interfaces support the different parts of a service order’s lifecycle.' },
      { title: 'A shared operational record', text: 'Service requests, production-stage progress, evaluations, and financial information use a shared PostgreSQL data model.' },
      { title: 'From interface to infrastructure', text: 'React and TypeScript at the frontend; JWT-protected Spring Boot services, Docker containers, and an OCI-hosted deployment behind NGINX.' },
    ],
    decisions: [
      { title: 'Separate role workflows', text: 'Dedicated Client, Responsable, and Manager services express the distinct business operations. Auth handles JWTs and roles, while Common centralizes shared entities and persistence.' },
      { title: 'Keep the data model honest', text: 'This system uses shared PostgreSQL persistence through the Common service. It is not represented as database-per-service microservices.' },
      { title: 'Describe the deployed entry path', text: 'NGINX handles the deployed entry path, routing requests into the Spring services running in containers on an OCI virtual machine.' },
    ],
    scopeNote: 'The report uses UGP and UniGharb for the platform presented here as ServiQ. The map follows the deployment chapter; a dedicated application gateway appears in the logical design, not as an extra asserted deployment component.',
    architecture: {
      title: 'Different roles. One operational picture.', caption: 'Deployment-oriented view from RAPPORT STAGE 2A.pdf, §§3.2.2–3.2.4. Shared storage and service names follow the report.', lanes: ['Experience', 'Entry & identity', 'Business workflows', 'Shared persistence'],
      nodes: [
        component('ui', 0, 1, 'Role-specific dashboards', 'React · TypeScript', 'Interfaces for industrial clients, technical responsables, and managers.', 'client'),
        component('proxy', 1, 0, 'Reverse proxy', 'NGINX · OCI VM', 'Terminates SSL and routes incoming requests to the containerized services.'),
        component('auth', 1, 2, 'Authentication', 'Spring Boot · JWT', 'Centralizes authentication and role checks for the platform.'),
        component('manager', 2, 0, 'Manager service', 'Spring Boot', 'Supervision, quotations, technical-responsible management, and performance indicators.'),
        component('respo', 2, 1, 'Responsable service', 'Spring Boot', 'Project assignments, progress, production-stage validation, and client communication.'),
        component('client', 2, 2, 'Client service', 'Spring Boot', 'Service ordering, project tracking, evaluation, and company profiles.'),
        component('common', 3, 0, 'Common service', 'Spring Data JPA', 'Shared domain entities, validation utilities, and centralized persistence.'),
        component('db', 3, 2, 'Business data', 'PostgreSQL', 'Shared users, service orders, evaluations, and financial records.', 'data'),
      ], edges: [link('ui', 'proxy', 'HTTPS'), link('proxy', 'auth', 'Identity'), link('proxy', 'manager', 'Routes'), link('proxy', 'respo', 'Routes'), link('proxy', 'client', 'Routes'), link('manager', 'common', 'Shared data'), link('respo', 'common', 'Shared data'), link('client', 'common', 'Shared data'), link('common', 'db', 'JPA')],
    },
    sources: [report('RAPPORT STAGE 2A.pdf', '§2.4.3, p. 24: logical services; §§3.2.2–3.2.4, pp. 31–32: deployment, shared persistence, and NGINX')],
  },
  {
    n: '05', slug: 'ensias-departments', title: 'ENSIAS Department Management', categories: ['Web applications'], tag: 'Academic project · Department systems', type: 'atlas', image: '/assets/projects/dep_manage.png', accent: '#d6aa68',
    stack: ['Spring Boot', 'React', 'PostgreSQL', 'Docker Compose', 'NGINX'],
    desc: 'A department-management application with public discovery and dedicated interfaces for administrators, department heads, program leads, and professors.',
    headline: 'An academic structure.\nA more human interface.', context: 'ENSIAS · Department management',
    contribution: 'Contributor to the ENSIAS department-management project. This case study follows the shared application’s React experience, role-oriented Spring Boot backend, and container deployment.',
    challenge: 'Departments, programs, modules, and teaching assignments are interconnected. Public information must stay approachable while staff operations respect each person’s responsibilities.',
    delivery: 'A React interface connected to role-oriented Spring Boot modules, with production Compose configuration for PostgreSQL and an NGINX SSL entry point.',
    capabilities: [
      { title: 'Public-facing discovery', text: 'The public interface presents department descriptions, programs, professors, and contact information.' },
      { title: 'Academic administration', text: 'Administrative workflows cover users, departments, professors, programs, modules, and teaching assignments.' },
      { title: 'A deployable service composition', text: 'The production Compose file explicitly includes auth, admin, chef-dep, prof-dep, chef-fil, frontend, PostgreSQL, and NGINX SSL containers.' },
    ],
    decisions: [
      { title: 'Organize around actual staff responsibilities', text: 'The backend modules mirror academic roles: administration, department leadership, program leadership, and professors.' },
      { title: 'Make deployment reproducible', text: 'Docker Compose brings the frontend, role-oriented backend services, PostgreSQL, and NGINX SSL proxy into a consistent deployment composition.' },
    ],
    scopeNote: 'Workflow descriptions follow the repository README. Container boundaries and shared PostgreSQL storage are verified against the production Compose file. The reviewed sources do not break down individual module ownership.',
    architecture: {
      title: 'The institution, expressed as software.', caption: 'Deployment structure verified in docker-compose.prod.yml and backend module names. Business responsibilities follow the repository’s documented scenarios.', lanes: ['Experience', 'Entry', 'Role-oriented services', 'Data'],
      nodes: [component('ui', 0, 1, 'Public & staff interface', 'React', 'Public department discovery and authenticated staff interfaces.', 'client'), component('proxy', 1, 1, 'SSL reverse proxy', 'NGINX', 'nginx-ssl is explicitly configured in the production Compose manifest.'), component('auth', 2, 0, 'auth · admin', 'Spring Boot modules', 'Authentication and administration modules configured as separate services.'), component('heads', 2, 1, 'chef-dep · chef-fil', 'Spring Boot modules', 'Department-head and program-lead modules.'), component('prof', 2, 2, 'prof-dep', 'Spring Boot module', 'Professor-facing backend module.'), component('db', 3, 1, 'Academic records', 'PostgreSQL 17', 'Shared database container declared in the production composition.', 'data')],
      edges: [link('ui', 'proxy', 'HTTPS'), link('proxy', 'auth', 'Routes'), link('proxy', 'heads', 'Routes'), link('proxy', 'prof', 'Routes'), link('auth', 'db', 'Persistence'), link('heads', 'db', 'Persistence'), link('prof', 'db', 'Persistence')],
    },
    sources: [repository('zackweb-pro/department-management-ensias', 'README: use cases; docker-compose.prod.yml: deployed components; Front-End/package.json: React stack')],
  },
  {
    n: '06', slug: 'gap', title: 'GAP / Personnel & Purchasing', categories: ['Web applications'], tag: 'Internship · Somap & Service', type: 'nova', image: '/assets/projects/dashboardsomap.png', accent: '#b9a37a',
    stack: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'MySQL', 'JWT'],
    desc: 'A full-stack system for employee records, daily attendance, purchase requests, approvals, and spending oversight.',
    headline: 'Every request. Every record.\nOne place to work.', context: 'First-year internship · Somap & Service, Kénitra',
    contribution: 'Full-stack delivery from stakeholder requirements and Figma interface design to React, Express APIs, MySQL, authentication, and functional testing.',
    challenge: 'Personnel information, daily attendance, and purchasing approvals need a consistent workflow, with different authority for administrators and team responsables.',
    delivery: 'GAP, an employee and purchasing-management application combining account approval, records management, attendance, request validation, and administrative dashboards.',
    capabilities: [
      { title: 'Personnel and attendance', text: 'Employee records, team-level management, daily attendance, and tracking of worked days.' },
      { title: 'Controlled purchasing', text: 'Purchase requests, approval workflows, categories, and spending views.' },
      { title: 'A complete application stack', text: 'React/Tailwind interfaces, Express routes on Node.js, MySQL persistence, password hashing, and JWT-based sessions.' },
    ],
    decisions: [
      { title: 'Keep the business workflow in the API', text: 'The browser provides the interaction layer; Express processes the requests and MySQL persists the operational records.' },
      { title: 'Design for the people doing the work', text: 'Stakeholder requirements and Figma interface design informed the frontend, followed by backend integration and functional testing of the business workflows.' },
    ],
    scopeNote: 'The report is the primary source. The public FrontEnd-PS repository corroborates purchasing, personnel, attendance interfaces, and the Express/MySQL/JWT stack.',
    architecture: {
      title: 'A focused stack for operational work.', caption: 'Application view reconstructed from the internship report, chapters 2–3, and the public backend package and frontend source tree.', lanes: ['Users', 'Experience', 'Application', 'Persistence'],
      nodes: [component('admin', 0, 0, 'Administrator', 'Account & approval workflows', 'Administrative access manages requests, users, and operational oversight.', 'client'), component('respo', 0, 2, 'Responsable', 'Personnel & purchasing', 'Responsable workflows manage team records, attendance, and purchasing.', 'client'), component('ui', 1, 1, 'GAP interface', 'React · Tailwind CSS', 'Screens for employee records, attendance, request processing, and dashboards.', 'client'), component('api', 2, 1, 'Business API', 'Node.js · Express · JWT', 'Request handling, authentication, and operational application logic.'), component('db', 3, 1, 'Operational records', 'MySQL', 'Persistent employee, attendance, account, and purchasing data.', 'data')],
      edges: [link('admin', 'ui', 'Browser'), link('respo', 'ui', 'Browser'), link('ui', 'api', 'API requests'), link('api', 'db', 'SQL')],
    },
    sources: [report('Rapport de stage 1A - Zakaria OUMGHAR.pdf', 'Chapters 2–3: requirements, role workflows, implementation, and technologies'), repository('zackweb-pro/FrontEnd-PS', 'server/package.json and personnel, purchasing, and attendance components')],
  },
  {
    n: '07', slug: 'internship-applications', title: 'Internship Applications', categories: ['Web applications'], tag: 'Team project · Information systems', type: 'nova', image: '/assets/projects/searchstage.png', accent: '#81a7de',
    stack: ['React', 'Node.js', 'Express', 'Oracle DB', 'OCI', 'Oracle APEX'],
    desc: 'An internship platform connecting students and recruiters, with a shared Oracle cloud database and an Oracle APEX administration interface.',
    headline: 'The next opportunity.\nA shared information system.', context: 'ENSIAS · Information systems project',
    contribution: 'Academic project with Doha Negraoui, connecting student and recruiter interfaces to an Express backend with modules for students, companies, offers, CVs, and administration.',
    challenge: 'Students, recruiters, and administrators need different interfaces to the same opportunity and application data, without maintaining separate conflicting records.',
    delivery: 'Student and recruiter web experiences supported by Express and Oracle, with an Oracle APEX dashboard for administration and statistics.',
    capabilities: [
      { title: 'Student and recruiter journeys', text: 'Students find internships and recruiters publish opportunities, with separate route modules for students, companies, and offers.' },
      { title: 'CV and administration modules', text: 'The Express entry point registers CV, school, administrator, login, and related application routes.' },
      { title: 'A shared database foundation', text: 'React and Express web interfaces share the Oracle cloud database with the APEX administrative interface.' },
    ],
    decisions: [
      { title: 'One information model, several interfaces', text: 'A centralized Oracle cloud database connects the student, recruiter, and APEX administration interfaces to the same underlying information.' },
      { title: 'Keep HTTP concerns modular', text: 'server/server.js registers separate route modules for administrative, company, student, CV, school, offer, and login functionality.' },
    ],
    scopeNote: 'Route modules and Oracle connection are source-verified. OCI hosting and APEX administration are supported by the published résumé; no undocumented deployment topology is asserted.',
    architecture: {
      title: 'Different interfaces. Shared information.', caption: 'Logical view from SI_Interface/server/server.js and the project description in the published résumé. The APEX branch is résumé-documented.', lanes: ['Participants', 'Web experience', 'Application', 'Shared information'],
      nodes: [component('student', 0, 0, 'Students', 'Internship search', 'Students browse internship opportunities through the web platform.', 'client'), component('recruiter', 0, 2, 'Recruiters', 'Opportunity publishing', 'Recruiters publish internship opportunities.', 'client'), component('ui', 1, 1, 'Web interfaces', 'React', 'Student and recruiter application interfaces.', 'client'), component('api', 2, 0, 'Application routes', 'Node.js · Express', 'Routes for students, companies, offers, CVs, schools, and administration.'), component('apex', 2, 2, 'Admin & statistics', 'Oracle APEX', 'An administration and statistics interface connected to the shared Oracle database.', 'client'), component('db', 3, 1, 'Shared cloud database', 'Oracle DB · OCI', 'Central data source for the platform’s web and administration interfaces.', 'data')],
      edges: [link('student', 'ui', 'Browser'), link('recruiter', 'ui', 'Browser'), link('ui', 'api', 'HTTP'), link('api', 'db', 'Oracle'), link('apex', 'db', 'Shared data')],
    },
    sources: [repository('zackweb-pro/SI_Interface', 'README: authors and project purpose; server/server.js: Express route modules and Oracle connection'), { title: 'Published project résumé', locator: 'Projects: Student Interface for Internship Applications', kind: 'Report', href: 'https://zakaria-oumghar.vercel.app/assets/ENG_RESUME_ZAKARIA_OUMGHAR_PROFESSIONAL.pdf' }],
  },
  {
    n: '08', slug: 'ensias-chatbot', title: 'ENSIAS Chatbot', categories: ['Other'], tag: 'Team project · Intent classification', type: 'zackweb', image: '/assets/projects/chatbot_ensias.png', accent: '#ce8c75',
    stack: ['Python', 'Flask', 'NeuralIntents', 'TensorFlow', 'JavaScript'],
    desc: 'An intent-based assistant that connects ENSIAS questions to useful responses, timetable information, courses, and school resources.',
    headline: 'Ask a question.\nFind your way through ENSIAS.', context: 'ENSIAS · First-year end-of-year project',
    contribution: 'Academic project co-authored with Omar Nebag, combining intent preparation, backend classification, Flask integration, and a browser-based conversation experience.',
    challenge: 'Useful school information is spread across different resources. A conversational interface needs to recognize the kind of help a student wants and guide them to the appropriate material.',
    delivery: 'A browser-based assistant using a trained intent model and Flask API, with responses and guided flows for school information, timetables, and courses.',
    capabilities: [
      { title: 'Intent-driven responses', text: 'JSON intent definitions contain tags, patterns, and responses; tag mappings connect recognized requests to functions.' },
      { title: 'A real browser-to-model flow', text: 'JavaScript sends messages to POST /predict. Flask calls the Python response logic and returns JSON to the frontend.' },
      { title: 'Guided information retrieval', text: 'Timetable and course interactions ask for semester and period, as well as department information and fallback help.' },
    ],
    decisions: [
      { title: 'Use the right name for the intelligence', text: 'NeuralIntents classifies a question into a supported intent. Mapped handlers then connect that intent to a specific information flow, keeping the conversation focused on ENSIAS resources.' },
      { title: 'Keep training data and conversation connected', text: 'Intent definitions provide the vocabulary of supported questions, while mapped handlers express the specific school-information workflows.' },
    ],
    scopeNote: 'A two-person academic project. No unsupported model-accuracy score, production user count, or generative-AI capability is claimed.',
    architecture: {
      title: 'From a message to a useful response.', caption: 'Request flow from Rapport chatbot ENSIAS.pdf, chapters 2–3, and PFA-FULL-EDITION/app.py.', lanes: ['Conversation', 'API', 'Understanding', 'Knowledge'],
      nodes: [component('ui', 0, 1, 'Conversation interface', 'HTML · CSS · JavaScript', 'Collects messages, manages the chat display, and renders responses.', 'client'), component('api', 1, 1, 'Prediction endpoint', 'Flask · POST /predict', 'Extracts the message from JSON, calls get_msg, and returns the response as JSON.'), component('intent', 2, 0, 'Intent recognition', 'Python · NeuralIntents', 'Recognizes the request’s intent using the trained model.'), component('handlers', 2, 2, 'Mapped handlers', 'Python functions', 'Tag-to-function mappings implement specific information retrieval flows.'), component('knowledge', 3, 1, 'Intent definitions', 'JSON · tags / patterns', 'Defines recognized expressions and responses for the supported intents.', 'data')],
      edges: [link('ui', 'api', 'JSON'), link('api', 'intent', 'get_msg'), link('intent', 'handlers', 'Intent tag'), link('knowledge', 'intent', 'Intent data')],
    },
    sources: [report('Rapport chatbot ENSIAS.pdf', 'Chapters 2–3: JSON intents, function mappings, Flask API, and frontend integration; §4.4.1: POST /predict'), repository('zackweb-pro/PFA-FULL-EDITION', 'app.py: Flask prediction route; requirements.txt: machine-learning dependencies')],
  },
  {
    n: '09', slug: 'formsaver-pro', title: 'FormSaver Pro', categories: ['Extensions'], tag: 'Published · Chrome extension', type: 'atlas', image: '/assets/projects/FormSaver%20Pro.png', accent: '#8fbd87',
    stack: ['JavaScript', 'Chrome Extension', 'Chrome Storage API', 'HTML', 'CSS'],
    desc: 'A published Chrome extension that saves form input locally and restores it after refreshes, with a popup for managing saved forms.',
    headline: 'Keep the words.\nLose the worry.', context: 'Independent browser extension · Published on Chrome Web Store',
    contribution: 'An independent browser extension published on the Chrome Web Store under zackweb, focused on form recovery and user control over locally saved inputs.',
    challenge: 'An accidental refresh can erase a carefully completed form. Recovery should stay close to the user’s task and leave control of saved content in the browser.',
    delivery: 'A browser utility for automatically saving supported input fields, restoring form values, and viewing or deleting saved forms through a popup.',
    capabilities: [
      { title: 'Save as people type', text: 'Automatically saves text and email fields, checkboxes, radio buttons, and other inputs, so an interrupted session doesn’t have to mean starting over.' },
      { title: 'Recover and manage', text: 'Saved values can be restored when returning to a page, with form grouping and popup-based deletion.' },
      { title: 'Local by design', text: 'Form data stays in Chrome storage on the user’s device, with no external transmission or analytics. Password fields are excluded from capture.' },
    ],
    decisions: [
      { title: 'Make recovery a browser-local loop', text: 'The recovery flow connects form inputs, extension scripts, local Chrome storage, and management UI without a server in the data path.' },
      { title: 'Put control in the user’s hands', text: 'The popup lets users review and delete saved forms. Local storage keeps recovery close to the task, while excluding password fields limits what the extension captures.' },
    ],
    scopeNote: 'Functional architecture from the published listing and privacy policy; extension implementation files were not available in the reviewed public repositories. No user-count or rating claims are embedded.',
    architecture: {
      title: 'A small product. A deliberate data boundary.', caption: 'Functional flow from the Chrome Web Store listing and publisher policy. Boxes describe responsibilities, not verified internal file boundaries.', lanes: ['Web page', 'Extension behavior', 'Browser storage', 'User control'],
      nodes: [component('form', 0, 1, 'Website form', 'Supported input fields', 'The user types into form fields. Password fields are excluded.', 'client'), component('capture', 1, 0, 'Save form values', 'Extension scripts', 'Automatically captures supported form inputs and groups saved forms.'), component('restore', 1, 2, 'Restore form values', 'Extension scripts', 'Restores saved values when the user returns to the page.'), component('storage', 2, 1, 'Saved form data', 'Chrome storage API', 'Stores saved form data locally in the browser, with no transmission to external servers.', 'data'), component('popup', 3, 1, 'Saved-form manager', 'Extension popup', 'Lets the user inspect and delete saved forms.', 'client')],
      edges: [link('form', 'capture', 'Input'), link('capture', 'storage', 'Save locally'), link('storage', 'restore', 'Read values'), link('restore', 'form', 'Restore'), link('popup', 'storage', 'Manage')],
    },
    sources: [{ title: 'FormSaver Pro · Chrome Web Store', locator: 'Published product behavior, password exclusion, and popup management', kind: 'Chrome Web Store', href: 'https://chromewebstore.google.com/detail/formsaver-pro/leojinnggakkmjlkbbihafeeaacidmkl' }, repository('zackweb-pro/privacy-policy', 'README: Chrome storage API, local processing, no analytics or external transmission', 'Publisher’s privacy policy')],
  },
  {
    n: '10', slug: 'nova-pioneers', title: 'Nova Pioneers', categories: ['Web applications'], tag: 'Team project · Space learning', type: 'atlas', image: '/assets/projects/plateform.png', accent: '#9d8cde',
    stack: ['Spring Boot', 'React', 'PostgreSQL', 'Spring Cloud Gateway', 'Docker', 'NASA API'],
    desc: 'A space-learning platform for children, with parent oversight, teacher course authoring, XP progression, and NASA-powered content.',
    headline: 'Make curiosity\na place to explore.', context: 'ENSIAS · Collaborative learning-platform project',
    contribution: 'Contributor to the collaborative Nova Pioneers learning platform. This case study presents the team’s shared work across a child-focused React experience and a domain-based Spring backend.',
    challenge: 'A learning experience for children has to feel welcoming while supporting parent oversight, teacher contributions, content structure, and a dependable progression model.',
    delivery: 'A React learning experience backed by Spring services for identity, parents and children, teachers and courses, and administration, with PostgreSQL and NASA content integration.',
    capabilities: [
      { title: 'Built around the learners', text: 'A child-focused interface with lessons, XP, achievement titles, and learning progress, plus parent visibility.' },
      { title: 'A content lifecycle', text: 'Teacher profiles, verification documents, courses organized into modules and lessons, and administrative review responsibilities.' },
      { title: 'A verifiable service composition', text: 'The production manifest includes API Gateway, Auth, Admin, Parents-Kids, Teachers-Courses, frontend, and PostgreSQL.' },
    ],
    decisions: [
      { title: 'Let domains shape the services', text: 'Parent-child relationships and progression sit in Parents-Kids; educator and course management sit in Teachers-Courses. Identity and administration are separate concerns.' },
      { title: 'Treat content and motivation as connected', text: 'Course enrollment, progress logs, XP, and achievement titles connect learning activities to visible progression. NASA APOD content enriches the learning experience through an external integration.' },
      { title: 'Package the learning platform', text: 'Docker Compose packages the gateway, identity, administration, parent-child, and teacher-course services alongside the frontend and PostgreSQL.' },
    ],
    scopeNote: 'Team project. Service topology is verified in the production Compose manifest; learning flows and NASA integration follow the shared technical report. Individual module ownership is not specified in the reviewed documentation.',
    architecture: {
      title: 'A learning world with clear boundaries.', caption: 'Verified in the shared repository’s technical report, §3, and docker-compose.prod.yml. NASA is shown as an external content source.', lanes: ['Experience', 'Entry', 'Application domains', 'Data & content'],
      nodes: [component('ui', 0, 1, 'Learning interfaces', 'React · Tailwind · Motion', 'Child, parent, teacher, and administrator experiences.', 'client'), component('gateway', 1, 1, 'API Gateway', 'Spring Cloud Gateway', 'Routes application requests to the Spring backend services.'), component('auth', 2, 0, 'Auth · Admin', 'Spring Boot services', 'Identity, registration, teacher verification, and administrative responsibilities.'), component('families', 2, 1, 'Parents-Kids service', 'Spring Boot', 'Parent-child profiles, enrollments, progress, ratings, XP, and achievement titles.'), component('courses', 2, 2, 'Teachers-Courses service', 'Spring Boot', 'Teacher profiles and structured educational courses, modules, and lessons.'), component('db', 3, 0, 'Learning records', 'PostgreSQL', 'Shared database container for users, courses, enrollment, progression, and feedback.', 'data'), component('nasa', 3, 2, 'NASA content', 'External APIs · APOD', 'Supplies space-related content, including Astronomy Picture of the Day, to the learning frontend.', 'external')],
      edges: [link('ui', 'gateway', 'REST'), link('gateway', 'auth', 'Routes'), link('gateway', 'families', 'Routes'), link('gateway', 'courses', 'Routes'), link('auth', 'db', 'Persistence'), link('families', 'db', 'Persistence'), link('courses', 'db', 'Persistence'), link('nasa', 'ui', 'Space content', 'external')],
    },
    sources: [repository('m-elhamlaoui/development-platform-nova-pioneers', 'README technical report, §§2–4; docker-compose.prod.yml; backend-services modules', 'Shared Nova Pioneers repository')],
  },
  {
    n: '11', slug: 'um5-notes-calculator', title: 'UM5 Notes Calculator', categories: ['Extensions'], tag: 'Published · Student utility', type: 'nova', image: '/assets/projects/um5-notes-calculator.png', accent: '#e1aa65',
    stack: ['JavaScript', 'Manifest V3', 'DOM', 'Chrome Storage API'],
    desc: 'A published extension that reads UM5 results, calculates averages, and suggests how missing module-validation points could be distributed.',
    headline: 'Grades into clarity.\nClarity into a next step.', context: 'Independent browser extension · Published on Chrome Web Store',
    contribution: 'An independent Chrome extension published under zackweb, combining result-table analysis, average calculations, and module-improvement suggestions directly in the UM5 portal.',
    challenge: 'A results table tells students their marks without necessarily explaining the combined average, retake selection, or where improvements could make a difference.',
    delivery: 'An in-page results layer with semester and general averages, highlighted selected grades, validation summaries, and per-element improvement suggestions.',
    capabilities: [
      { title: 'Read the results in context', text: 'Selects session results using validation status and retake results, then presents overall and semester averages.' },
      { title: 'Turn a shortfall into a suggestion', text: 'module-validation.js handles point-distribution suggestions. It uses inferred coefficients to suggest how missing points could be distributed across module elements.' },
      { title: 'Stay within the browser', text: 'The Manifest V3 extension targets the UM5 portal, loads two content scripts, and stores the popup’s enabled state between sessions.' },
    ],
    decisions: [
      { title: 'Separate extraction from validation logic', text: 'The manifest loads module-validation.js and content.js. This separates calculation and display from the module-optimization algorithms.' },
      { title: 'Make algorithm limits part of the product', text: 'Estimated coefficients and optimization suggestions do not guarantee official academic validation. The interface presents them as guidance for understanding the shortfall.' },
      { title: 'Scope the integration to its host', text: 'The manifest targets etu.um5.ac.ma and declares activeTab and storage. The extension processes results locally in the browser.' },
    ],
    scopeNote: 'The repository documents the calculation rules implemented by this extension; they are not presented as independently verified official university regulations. Improvement suggestions use estimated coefficients.',
    architecture: {
      title: 'From the results table to an explanation.', caption: 'Verified against manifest.json and the documented implementation in note-etu-um5. Processing remains in the browser.', lanes: ['Portal', 'Content scripts', 'Feedback', 'Controls'],
      nodes: [component('portal', 0, 1, 'UM5 results table', 'etu.um5.ac.ma', 'The extension is configured for the UM5 student portal.', 'client'), component('content', 1, 0, 'Read & calculate', 'content.js', 'Extracts results, calculates averages, and presents in-page feedback.'), component('validation', 1, 2, 'Module suggestions', 'module-validation.js', 'Estimates coefficients and distributes suggested improvement points.'), component('display', 2, 1, 'In-page results layer', 'HTML · CSS', 'Displays averages, module status, highlighted grades, and optimization hints.', 'client'), component('popup', 3, 0, 'Enable / disable', 'popup.html · popup.js', 'Popup controls the extension’s enabled state.', 'client'), component('storage', 3, 2, 'Persistent preferences', 'Chrome storage', 'Preserves the extension state between browser sessions.', 'data')],
      edges: [link('portal', 'content', 'Read DOM'), link('content', 'validation', 'Module data'), link('content', 'display', 'Averages'), link('validation', 'display', 'Suggestions'), link('popup', 'storage', 'State')],
    },
    sources: [repository('zackweb-pro/note-etu-um5', 'manifest.json: host and content scripts; README: rules, file structure, and algorithm limitations'), { title: 'UM5 Notes Calculator · Chrome Web Store', locator: 'Published extension identity and product behavior', kind: 'Chrome Web Store', href: 'https://chromewebstore.google.com/detail/um5-notes-calculator/cpihipnfplagfcmplcbjmpnopenejckd' }],
  },
];
