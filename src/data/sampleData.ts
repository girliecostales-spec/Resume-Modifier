import { JobPostingInput, ResumeSectionsInput } from "../types";

export interface SampleRole {
  id: string;
  roleName: string;
  category: string;
  job: JobPostingInput;
  resume: ResumeSectionsInput;
}

export const SAMPLE_PRESETS: SampleRole[] = [
  {
    id: "fullstack-engineer",
    roleName: "Senior Full-Stack Engineer (React, Node, Cloud)",
    category: "Software Engineering",
    job: {
      jobTitle: "Senior Full-Stack Software Engineer (Cloud Platform)",
      jobDescription: `Nexus Cloud is seeking a Senior Full-Stack Engineer to architect, build, and scale our enterprise data management portal. In this role, you will lead the modernization of our front-end architecture to React 19 and Next.js, design high-throughput REST and GraphQL microservices in Node.js/TypeScript, and orchestrate serverless container workloads on AWS (ECS, Lambda, CloudWatch). You will collaborate closely with product managers, UX designers, and DevOps engineers to deliver mission-critical features with 99.99% uptime.`,
      jobRequirements: `Key Roles & Responsibilities:
- 5+ years of production experience with modern JavaScript/TypeScript, React.js, and Node.js.
- Strong expertise in API architecture (RESTful, GraphQL, WebSocket real-time communication).
- Hands-on experience with AWS cloud infrastructure (Lambda, ECS, S3, RDS PostgreSQL, CloudWatch).
- Proven track record implementing automated CI/CD pipelines (GitHub Actions, Docker) and comprehensive unit/integration testing (Jest, Playwright).
- Deep understanding of database schema design, indexing, and query optimization for PostgreSQL & Redis caching.
- Experience with Agile/Scrum methodologies, code reviews, and mentoring junior developers.
- Bachelor’s or Master’s in Computer Science or equivalent practical experience.`,
    },
    resume: {
      careerSummary: `Software engineer with 4 years of experience building web applications using JavaScript and React. Passionate about writing clean code and improving UI interfaces for end users.`,
      coreCompetencies: `JavaScript, React.js, HTML5, CSS3, Express.js, MongoDB, Git, Agile, REST APIs, Tailwind CSS.`,
      handsOnProjects: `E-Commerce Storefront:
- Built a web shop using React and Express.
- Added payment integration with Stripe API.
- Implemented product search and shopping cart state with Redux.`,
      professionalExperience: `Full Stack Developer | Acme Web Solutions (2022 - Present)
- Developed front-end components for client websites using React and Tailwind.
- Created backend endpoints in Node.js to fetch data from MongoDB databases.
- Participated in weekly sprint planning and resolved bug tickets.

Junior Web Developer | TechStart Inc. (2020 - 2022)
- Built landing pages and responsive UI widgets using HTML, CSS, and vanilla JavaScript.
- Collaborated with QA team to fix cross-browser compatibility issues.`,
    },
  },
  {
    id: "product-manager",
    roleName: "Lead Product Manager (B2B SaaS)",
    category: "Product Management",
    job: {
      jobTitle: "Lead Product Manager - Enterprise Platform",
      jobDescription: `ScaleForge is hiring a Lead Product Manager to own our core enterprise workflow automation suite. You will define the multi-year product roadmap, lead cross-functional squads of engineers and designers, conduct qualitative user research and quantitative product analytics (Mixpanel, Amplitude), and drive ARR growth and net revenue retention across Fortune 500 accounts.`,
      jobRequirements: `Key Roles & Responsibilities:
- 5+ years of B2B SaaS Product Management experience owning complex enterprise products.
- Proven mastery of data-driven decision making, cohort retention analysis, and product analytics (Mixpanel, SQL, Looker).
- Track record of driving product-led growth (PLG), customer onboarding conversion, and feature adoption.
- Experience working closely with enterprise Sales, Customer Success, and Solutions Architects.
- Excellent stakeholder communication, PRD (Product Requirement Document) writing, and OKR setting.
- Technical fluency with cloud APIs, third-party integrations, and security compliance (SOC 2, GDPR).`,
    },
    resume: {
      careerSummary: `Product Manager with experience overseeing software development cycles and collaborating with engineering teams. Dedicated to creating good user experiences and delivering project milestones on time.`,
      coreCompetencies: `Product Roadmap, User Stories, Agile Scrum, Jira, Wireframing, User Interviews, Cross-functional collaboration.`,
      handsOnProjects: `Customer Portal Redesign:
- Researched user feedback to redesign the account settings page.
- Wrote feature tickets in Jira and tracked team velocity.`,
      professionalExperience: `Product Manager | CloudWorks Software (2021 - Present)
- Managed feature backlogs and groomed user stories for a 6-person engineering team.
- Gathered feature requests from internal stakeholders and prioritized sprint tickets.
- Coordinated product releases and wrote release notes for customers.

Associate Product Specialist | DataFlow Systems (2019 - 2021)
- Assisted senior PMs with user testing sessions and bug triaging.
- Created presentation decks for quarterly business reviews.`,
    },
  },
  {
    id: "data-analyst",
    roleName: "Senior Business Intelligence & Data Analyst",
    category: "Data & Analytics",
    job: {
      jobTitle: "Senior BI & Data Analytics Specialist",
      jobDescription: `Apex Financial is looking for a Senior Data Analyst to lead our commercial intelligence reporting. You will transform complex transactional data into actionable executive dashboards, build scalable automated ETL pipelines, conduct statistical churn and lifetime value (LTV) forecasting, and partner with executive leadership to inform strategic investments.`,
      jobRequirements: `Key Roles & Responsibilities:
- 4+ years of professional analytics experience querying large relational and cloud data warehouses (Snowflake, BigQuery, PostgreSQL).
- Advanced SQL proficiency (CTEs, Window Functions, dynamic query optimization, indexing).
- Deep experience designing interactive executive dashboards using Tableau, Power BI, or Looker.
- Scripting and statistical modeling in Python (Pandas, NumPy, Scikit-learn) or R for predictive analysis.
- Experience building automated data pipelines with dbt, Airflow, or Fivetran.
- Strong executive presentation skills and business acumen to translate analytics into commercial growth levers.`,
    },
    resume: {
      careerSummary: `Data Analyst with experience working with databases and Excel. Skilled in generating periodic reports and assisting business teams with data questions.`,
      coreCompetencies: `SQL, Excel, Tableau, Microsoft Office, Data Cleaning, Reporting, Basic Python.`,
      handsOnProjects: `Sales Performance Tracker:
- Built a monthly sales dashboard in Tableau to monitor team revenue.
- Cleaned CSV datasets using Excel formulas and pivot tables.`,
      professionalExperience: `Data Analyst | Metro Retail Group (2021 - Present)
- Extracted sales data using SQL queries from internal relational databases.
- Updated weekly KPI spreadsheets and distributed summaries to department managers.
- Responded to ad-hoc data requests from marketing and inventory teams.

Junior Analyst | Insight Partners (2019 - 2021)
- Verified data entry records and resolved discrepancy logs in Excel.
- Created basic charts and graphs for monthly client reports.`,
    },
  },
];
