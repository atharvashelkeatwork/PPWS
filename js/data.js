/*
 * Single source of truth for the portfolio.
 * Edit content here only; both the Document and Response views read from it.
 */
window.PORTFOLIO = {
  profile: {
    name: "Atharva Vilas Shelke",
    title: "Java Backend Developer",
    location: "Thane, Maharashtra, India",
    availability: "AVAILABLE",
    openTo: "Java Software Developer roles",
    summary: "Computer Engineering graduate with a strong foundation in Core Java, OOP, SQL and Java backend development. Hands-on experience with JDBC, Servlets, Hibernate/JPA and Spring Boot, with project experience in REST APIs and relational databases. Seeking a Java Software Developer role to apply and strengthen backend development skills in a production environment.",
    links: {
      email: "atharvashelkeatwork@gmail.com",
      phone: "+91 9820197485",
      linkedin: "https://linkedin.com/in/atharvashelkeatwork",
      github: "https://github.com/atharvashelkeatwork",
      resume: "assets/Atharva_Shelke_Java_Developer.pdf"
    },
    education: [
      {
        institution: "Dilkap Research Institute of Engineering and Management Studies, University of Mumbai",
        credential: "Bachelor of Engineering (B.E.) in Computer Engineering",
        period: "2021 - 2026",
        result: "CGPA 7.72",
        location: "Thane, Maharashtra"
      },
      {
        institution: "G.E.I.’s M. H. High School & Junior College, University of Mumbai",
        credential: "Higher Secondary Certificate (HSC), Bifocal Computer Science",
        period: "2019 - 2021",
        result: "75.83%",
        location: "Thane, Maharashtra"
      },
      {
        institution: "IRA Global School",
        credential: "International General Certificate of Secondary Education (IGCSE)",
        period: "2018 - 2019",
        result: "60.43%",
        location: "Dombivli, Maharashtra"
      }
    ],
    certifications: [
      { name: "Java Full Stack Developer", issuer: "QSpider" }
    ]
  },

  projects: [
    {
      id: "online-movie-booking-system",
      name: "Online Movie Booking System",
      type: "RESTful backend API",
      summary: "A RESTful backend where customers browse movies and showtimes, check seat availability, purchase tickets and cancel purchases, while admins manage movies, theatres, screens and showtimes.",
      highlights: [
        "Stateless JWT authentication with BCrypt password hashing and role-based authorization (Customer and Admin); customers can view only their own booking details.",
        "Per-show seat reservation (ShowSeat) with transactional booking and cancellation, backed by database constraint checks that prevent duplicate bookings."
      ],
      stack: ["Java", "Spring Boot", "Spring MVC", "Spring Data JPA (Hibernate)", "Spring Security", "JWT", "ModelMapper", "PostgreSQL", "Maven", "Swagger/OpenAPI", "JUnit", "Mockito"],
      links: { repo: null, demo: null }
    },
    {
      id: "jnativekit",
      name: "JNativeKit (JNK)",
      type: "Cross-platform Java library",
      summary: "An OS-agnostic Java library exposing one common interface across Windows, macOS and Linux for native desktop capabilities: notifications, system tray, auto-start and credentials management.",
      highlights: [
        "Maven multi-module structure: a common API library plus OS-specific provider implementations selected at runtime through Java SPI (ServiceLoader).",
        "Capability/result model with explicit result codes (AVAILABLE, UNSUPPORTED, MISSING_DEPENDENCY, PERMISSION_DENIED) to report failures in unsupported environments, validated with a GitHub Actions CI matrix."
      ],
      stack: ["Java 17", "JNA", "Maven (multi-module)", "Service Loader (SPI)", "JUnit 5", "GitHub Actions", "Git/GitHub", "Linux"],
      links: { repo: null, demo: null }
    },
    {
      id: "employee-management-system",
      name: "Employee Management System",
      type: "Java web application",
      summary: "A Java web application for managing employee information, with server-side rendering through JSP and request handling through Jakarta Servlets.",
      highlights: [
        "Full CRUD (add, view, edit, delete) driven by a single JSP form; employee IDs are generated automatically by the database, and deletion requires a confirmation prompt.",
        "HTTP Session tracks the most recently updated employee; a cookie stores the default department."
      ],
      stack: ["Java", "JSP", "Jakarta Servlets", "Hibernate (JPA)", "PostgreSQL", "Apache Maven", "Apache Tomcat"],
      links: { repo: null, demo: null }
    }
  ],

  skills: {
    "core-java": ["OOP", "Collections", "Exception Handling", "Multithreading"],
    "advanced-java": ["JDBC", "Hibernate with JPA", "Servlets", "JSP"],
    "frameworks": ["Spring Framework", "Spring MVC", "Spring Boot", "Spring Security"],
    "rest-api": ["REST API development", "JSON", "Postman"],
    "frontend": ["HTML5", "CSS3", "JavaScript"],
    "databases": ["Oracle SQL", "PostgreSQL"],
    "tools-and-platforms": ["Eclipse IDE", "Maven", "Git/GitHub", "Linux"],
    "testing": ["JUnit", "Mockito", "Manual Testing"]
  }
};
