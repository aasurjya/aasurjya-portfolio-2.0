\documentclass[10pt]{article}
\usepackage{amsmath}
\usepackage{amssymb}
\usepackage{ragged2e}
\usepackage{hyperref}
\usepackage{fontawesome}
\usepackage{xcolor}
\usepackage{fullpage}
\usepackage{enumitem}
\usepackage{tikz}
\usetikzlibrary{positioning}

% Link colors
\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    urlcolor=blue
}

\pagestyle{empty}
\raggedright

\setlength{\textheight}{9.5in}
\setlength{\topmargin}{-0.5in}

% Custom commands
\newcommand{\tab}{\hspace{2em}}
\newcommand{\sbt}{\textbullet\ }
\newcommand{\header}[1]{\textsc{#1} \\ \hspace*{-0.1in} \hrulefill \\}
\newcommand{\employer}[3]{\textbf{#1} \hfill #2\\ \textit{#3}\\}
\newcommand{\contact}[2]{\begin{center} {\LARGE \textbf{#1}} \\ #2 \end{center} \vspace*{-5pt}}
\newcommand{\school}[4]{\textbf{#1} \hfill #2 \\ #3 \\}

\begin{document}
\pagenumbering{gobble}
\small

\vspace*{-25pt}
{\footnotesize \textit{Note: Blue-colored text indicates clickable links to live applications or source repositories.}}

\contact{Aasurjya Bikash Handique}{
    \href{https://aasurjya.vercel.app}{\faGlobe\,aasurjya.vercel.app} $\sbt$
    \href{https://www.linkedin.com/in/aasurjya-bikash-handique-29484417a/}{\faLinkedin\,LinkedIn} $\sbt$
    \href{https://github.com/aasurjya}{\faGithub\,GitHub} $\sbt$
    \href{https://www.canva.com/design/DAGNu_PYjqk/yvGJnfarxclW2mOi6dJ93w/view}{\faFilePowerpointO\, AR/VR Portfolio Videos} $\sbt$
    \href{https://www.youtube.com/channel/UC0di45PS9sc2X-CbTgTgMuw}{\faYoutube\,YouTube} \\[4pt]
    \href{mailto:ahandique8@gmail.com}{\faEnvelope\,ahandique8@gmail.com} $\sbt$
    \faPhone\ +91-9365384660
}

% ================= ABOUT =================
\section*{About Me}
I am a Full-Stack Software Engineer with strong expertise in \textbf{Flutter, Python, and scalable SaaS systems}, complemented by a solid background in XR technologies. I hold an M.Tech in Augmented Reality and Virtual Reality from IIT Jodhpur and have hands-on experience designing \textbf{multi-tenant architectures}, role-based systems, and performance-critical applications. In addition to engineering, I independently \textbf{design and build end-to-end web experiences}, conducting design research, analyzing UX patterns, and translating visual inspiration into clean, production-ready interfaces. My work spans mobile-first SaaS platforms, backend services, cloud-native deployments, and immersive 3D systems for education, enterprise, and real-world production use.

% ================= EDUCATION =================
\header{Education}
\school{IIT Jodhpur}{2022 -- 2025}{M.Tech in Augmented Reality and Virtual Reality}{}
\school{Tezpur University}{2018 -- 2022}{B.Tech in Computer Science and Engineering (First Division)}{}

% ================= EXPERIENCE =================
\header{Experience}

\vspace{1mm} \href{https://ihub-drishti.ai/about-us/introduction}{iHub Drishti} \\[0.5mm] Sep 2023 - Present \newline \begin{tikzpicture}[baseline=(current bounding box.center)] \foreach \y/\text in {0.5/Tech Engineer, -0.5/Research Associate} { \filldraw[gray] (0,\y) circle (2pt); \node[right] at (0.2,\y) {\textbf{\text}}; } \draw[gray] (0,0.5) -- (0,-0.5); \end{tikzpicture} \vspace{1mm}

\begin{itemize}[leftmargin=*, itemsep=0pt]
    \item Designed and developed scalable \textbf{Flutter applications} with modular architecture and predictable state management.
    \item Built \textbf{Analyze python based e57 files analyses} for automation, point cloud to Gaussian splats.
    \item Architected \textbf{multi-tenant and role-based systems} emphasizing security and maintainability.
    \item Developed AR/VR systems using Unity, ARKit, and ARCore with strong focus on performance optimization.
    \item Worked with AWS-based deployments and asset delivery workflows.
\end{itemize}

\employer{\href{https://heptre.com}{Heptre}}{Jul 2022 -- Sep 2023}{Full Stack Developer}
\begin{itemize}[leftmargin=*, itemsep=0pt]
    \item Built production web applications using React and Next.js.
    \item Managed AWS infrastructure (EC2, S3, SQS, Lambda).
    \item Containerized and deployed systems using Docker and Kubernetes.
    \item Managed infrastructure using Terraform.
\end{itemize}

\employer{\href{https://www.iqvia.com}{IQVIA}}{Aug 2022 -- Dec 2022}{Software Engineer Intern}
\begin{itemize}[leftmargin=*, itemsep=0pt]
    \item Integrated APIs with MongoDB-backed services.
    \item Implemented 1000+ unit tests for backend stability.
\end{itemize}

\employer{\href{https://www.cognizant.com}{Cognizant}}{Feb 2022 -- Aug 2022}{Programmer Analyst Trainee}
\begin{itemize}[leftmargin=*, itemsep=0pt]
    \item Developed SQL pipelines and analytical dashboards.
\end{itemize}

\vspace{1.5mm}
% ================= PROJECTS =================
\header{Full-Stack Projects}

\textbf{EduSaaS -- School Management System}
\hfill
\href{https://aasurjya.github.io/Flutter-school-management-/}{Live}
\ \textbar\ 
\href{https://github.com/aasurjya}{GitHub} \\
\emph{Multi-Tenant Education SaaS}
\begin{itemize}[leftmargin=*, itemsep=0pt]
    \item Architected a \textbf{multi-tenant SaaS system} with strict tenant-level isolation using Row-Level Security.
    \item Designed role-based dashboards for admins, teachers, students, and parents.
    \item Implemented \textbf{offline-first synchronization} with local caching and conflict resolution.
    \item Delivered core modules: authentication, attendance, exams, fees, messaging.
\end{itemize}

\vspace{1.5mm}

\textbf{NexProp -- Premium Real Estate Platform}
\hfill
\href{https://nexprop.vercel.app/}{Live} \\
\emph{Full-Stack Development with 3D Visualization}
\begin{itemize}[leftmargin=*, itemsep=0pt]
    \item Built an interactive \textbf{3D building viewer} with unit-level inspection and camera controls.
    \item Optimized GLTF asset loading for smooth performance on web and mobile.
    \item Implemented responsive state management and efficient data fetching.
    \item Designed animation-rich interfaces without compromising performance.
\end{itemize}

\vspace{1.5mm}

\textbf{Ghor Bhara -- Assamese Rental Marketplace}
\hfill
\href{https://tiloirent.vercel.app/}{Live} \\
\emph{Full-Stack Marketplace Platform}
\begin{itemize}[leftmargin=*, itemsep=0pt]
    \item Built a multi-role rental marketplace supporting tenants, landlords, and admins.
    \item Implemented secure payment flows and document uploads.
    \item Designed role-based dashboards and analytics views.
    \item Established automated end-to-end testing for production stability.
\end{itemize}

\vspace{1.5mm}

\textbf{pokharas.com -- Travel Marketplace}
\hfill
\href{https://pokharas.com}{Live} \\
\emph{Travel \& Hospitality Platform for Nepal}
\begin{itemize}[leftmargin=*, itemsep=0pt]
    \item Built a content-rich travel marketplace with curated listings and discovery flows.
    \item Implemented category-based search and filtering for local services.
    \item Delivered a cohesive visual identity optimized for international audiences.
\end{itemize}

\vspace{1.5mm}

\textbf{NEXVR}
\hfill
\href{https://nexvr.vercel.app/}{Live} \\
\emph{Product Design \& Frontend Engineering}
\begin{itemize}[leftmargin=*, itemsep=0pt]
    \item Led frontend engineering for an immersive 3D real estate showcase platform.
    \item Built storytelling-driven landing experiences combining 3D scenes and motion design.
    \item Integrated live system metrics and performance indicators.
\end{itemize}

\vspace{1.5mm}
\textbf{Real-Time Face Recognition System}
\hfill
\href{https://github.com/aasurjya/Face-Recognization}{GitHub} \\
\emph{Computer Vision \& Python Project}
\begin{itemize}[leftmargin=*, itemsep=0pt]
    \item Built a real-time face recognition system using Python and OpenCV with live webcam input.
    \item Implemented face detection and \textbf{128-dimensional face embeddings} for identity recognition.
    \item Designed a matching pipeline that compares live face encodings against stored encodings using similarity counts.
    \item Handled unknown face detection by threshold-based matching logic.
    \item Structured the system with reusable utility modules for face detection, encoding, and matching.
\end{itemize}

\textbf{Movies App}
\hfill
\href{https://aasurjya-movies-app.netlify.app/}{Live}
\ \textbar\ 
\href{https://github.com/aasurjya/movies-app-vue}{GitHub} \\
\emph{Frontend Development and API Integration}
\begin{itemize}[leftmargin=*, itemsep=0pt]
    \item Built a responsive movie browsing interface using Vue.js.
    \item Integrated third-party APIs and deployed to production.
\end{itemize}
\vspace{1.5mm}
\header{UI/UX Design}

\textbf{World Ranger Website UI Design}
\hfill
\href{https://www.asianrangerforum.org/}{Live Website} \\
\emph{Sole UI Designer} \\
Served as the sole UI designer for the \textbf{World Ranger} website, the primary digital platform for the \textbf{1st Asian Ranger Forum} in Guwahati. Designed an intuitive and visually engaging interface using dynamic color schemes and mood features to enhance user immersion, aligning the visual identity with the forum’s theme of \textbf{“Asia’s Biodiversity Guardians.”}


\vspace{1mm} \header{Extracurricular Activities} \vspace{1mm} \begin{itemize}[leftmargin=*, itemsep=0pt] \item \textbf{Hackathon Participation:}\textbf{ I conceptualized and led the idea that propelled our team to a top 10 in \href{https://ihub-drishti.ai/hackathon/}{\textcolor{blue}{\textbf{Pragti AR/VR Hackathon}}} and top 5 in \href{https://unstop.com/hackathons/green-fintech-hackathon-indian-institute-of-technology-iit-jodhpur-1061860}{\textcolor{blue}{\textbf{Green Fintech Hackathon conducted by RBI}}}.} \item \textbf{Tech Community Engagement:} Managed workshops to share knowledge and experiences in AR/VR technology conducted by DST (Department of Science & Technology) at IIT Jodhpur. \end{itemize}

\end{document}
