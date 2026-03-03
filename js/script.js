document.addEventListener("DOMContentLoaded", () => {
  // Initialize AOS
  AOS.init({
    duration: 1000,
    once: true,
  });

  // GSAP Animations
  gsap.registerPlugin(ScrollTrigger);

  // Scroll Progress Bar Logic
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.appendChild(progressBar);

  window.addEventListener("scroll", () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    progressBar.style.width = scrolled + "%";
  });

  const tl = gsap.timeline();
  tl.from(".hero-title", { duration: 1.5, y: 100, opacity: 0, ease: "expo.out" })
    .from(".hero-subtitle", { duration: 1.2, y: 50, opacity: 0, ease: "expo.out" }, "-=1")
    .from("nav", { duration: 1, y: -100, opacity: 0, ease: "expo.out" }, "-=1.2")
    .from(".about-interests span", { duration: 0.8, scale: 0, opacity: 0, stagger: 0.1, ease: "back.out(1.7)" }, "-=0.5");

  // Scroll Animations for Sections
  gsap.utils.toArray("section").forEach((section) => {
    // Skip #education to ensure it's always visible (user report fix)
    if (section.id === "education") return;

    // Only animate direct children of the section or content containers
    const items = section.querySelectorAll("h2, .project-card, .blog-card, .timeline-item, .about-content, .scroller, form, .gallery-grid img");
    if (items.length > 0) {
      gsap.from(items, {
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      });
    }
  });

  // Custom Cursor Follower
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  document.body.appendChild(cursor);

  document.addEventListener("mousemove", (e) => {
    gsap.to(cursor, {
      x: e.clientX,
      y: e.clientY,
      duration: 0.2,
      ease: "power2.out",
    });
  });

  document.querySelectorAll("a, button, .project-card, .blog-card").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });

  // Three.js Background Upgrade: Dynamic Particle System
  let scene, camera, renderer, particles, particleSystem;
  let mouseX = 0,
    mouseY = 0;
  const count = 2000;

  function initThree() {
    const canvas = document.getElementById("bg-canvas");
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particle Geometry
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const color = new THREE.Color(Math.random() < 0.5 ? 0x4285f4 : 0x34a853);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 0.1 + 0.05;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    document.addEventListener("mousemove", onMouseMove);
    animate();
  }

  function onMouseMove(event) {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
  }

  function animate() {
    requestAnimationFrame(animate);

    particleSystem.rotation.y += 0.001;
    particleSystem.rotation.x += 0.0005;

    // Subtle mouse influence
    particleSystem.position.x += (mouseX - particleSystem.position.x) * 0.05;
    particleSystem.position.y += (-mouseY - particleSystem.position.y) * 0.05;

    renderer.render(scene, camera);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("resize", onWindowResize, false);

  initThree();

  // Hamburger Menu Functionality
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  const links = document.querySelectorAll(".nav-links li");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      hamburger.classList.toggle("toggle");
      document.body.classList.toggle("no-scroll");
    });

    // Close menu when a link is clicked
    links.forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger.classList.remove("toggle");
        document.body.classList.remove("no-scroll");
      });
    });
  }

  // Project Modal Functionality
  const projectCards = document.querySelectorAll(".project-card");
  const modal = document.getElementById("project-modal");
  const closeModal = document.querySelector(".close-modal");
  const modalImg = document.getElementById("modal-img");
  const modalTitle = document.getElementById("modal-title");
  const modalDescription = document.getElementById("modal-description");

  projectCards.forEach((card) => {
    card.addEventListener("click", () => {
      const title = card.getAttribute("data-title");
      const image = card.getAttribute("data-image");
      const description = card.getAttribute("data-description");

      modalImg.src = image;
      modalTitle.textContent = title;
      modalDescription.textContent = description;

      modal.classList.add("active");
    });
  });

  const hideModal = () => {
    modal.classList.remove("active");
  };

  closeModal.addEventListener("click", hideModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      hideModal();
    }
  });

  // Blog Modal Functionality
  const blogCards = document.querySelectorAll(".blog-card");
  const blogModal = document.getElementById("blog-modal");
  const closeBlogModal = blogModal.querySelector(".close-modal");
  const blogModalContent = document.getElementById("blog-modal-content");

  blogCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      // If the user clicked a link, let preventDefault handle it
      if (e.target.tagName === "A") e.preventDefault();

      const postId = card.getAttribute("data-post-id");
      const postContent = document.getElementById(`${postId}-content`);

      if (postContent) {
        blogModalContent.innerHTML = ""; // Clear previous content
        const clonedContent = postContent.cloneNode(true);
        clonedContent.style.display = "block"; // Make the cloned content visible
        blogModalContent.appendChild(clonedContent);
        blogModal.classList.add("active");
      }
    });
  });

  const hideBlogModal = () => {
    blogModal.classList.remove("active");
    blogModalContent.innerHTML = ""; // Clear content when closing
  };

  closeBlogModal.addEventListener("click", hideBlogModal);
  blogModal.addEventListener("click", (e) => {
    if (e.target === blogModal) {
      hideBlogModal();
    }
  });

  // Gallery Modal Functionality
  const galleryImages = document.querySelectorAll(".gallery-grid img");
  const galleryModal = document.getElementById("gallery-modal");
  const closeGalleryModal = galleryModal.querySelector(".close-modal");
  const galleryModalImg = document.getElementById("gallery-modal-img");

  galleryImages.forEach((img) => {
    img.addEventListener("click", () => {
      galleryModalImg.src = img.src;
      galleryModal.classList.add("active");
    });
  });

  const hideGalleryModal = () => {
    galleryModal.classList.remove("active");
  };

  closeGalleryModal.addEventListener("click", hideGalleryModal);
  galleryModal.addEventListener("click", (e) => {
    if (e.target === galleryModal) {
      hideGalleryModal();
    }
  });

  // Skills Scroller
  const scrollers = document.querySelectorAll(".scroller");

  // If a user hasn't opted in for reduced motion, add the animation
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    addAnimation();
  }

  function addAnimation() {
    scrollers.forEach((scroller) => {
      // add data-animated="true" to every `.scroller` on the page
      scroller.setAttribute("data-animated", true);

      const scrollerInner = scroller.querySelector(".scroller__inner");
      const scrollerContent = Array.from(scrollerInner.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        duplicatedItem.setAttribute("aria-hidden", true);
        scrollerInner.appendChild(duplicatedItem);
      });
    });
  }

  // Contact Form Submission
  const form = document.querySelector("#contact form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const status = document.createElement("p");
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        status.textContent = "Terima kasih! Pesan Anda telah terkirim.";
        status.style.color = "green";
        form.reset();
      } else {
        status.textContent = "Oops! Terjadi masalah saat mengirim pesan Anda.";
        status.style.color = "red";
      }
    } catch (error) {
      status.textContent = "Oops! Terjadi masalah saat mengirim pesan Anda.";
      status.style.color = "red";
    }

    form.appendChild(status);
    setTimeout(() => {
      status.remove();
    }, 5000);
  });

  // Theme Toggle Functionality
  const themeToggleBtn = document.getElementById("theme-toggle");
  const body = document.body;

  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  const applyTheme = (theme) => {
    if (theme === "light") {
      body.classList.add("light-theme");
      themeToggleBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-sun-fill" viewBox="0 0 16 16"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 0-.707.707l1.414 1.414a.5.5 0 0 0 .707 0zM4.464 4.465a.5.5 0 0 0-.707 0L2.343 3.05a.5.5 0 1 0-.707.707l1.414 1.414a.5.5 0 0 0 .707 0z"/></svg>';
    } else {
      body.classList.remove("light-theme");
      themeToggleBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-moon-fill" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.732 16 0 12.28 0 7.71 0 4.272 2.134 1.57 5.124.66A.757.757 0 0 1 6 .278z"/></svg>';
    }
  };

  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Initial application based on system preference if no saved theme
    applyTheme(prefersDark.matches ? "dark" : "light");
  }

  // Listen for system theme changes
  prefersDark.addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });

  themeToggleBtn.addEventListener("click", () => {
    let currentTheme = body.classList.contains("light-theme") ? "light" : "dark";
    let newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  });

  // AI Chatbot Functionality Upgrade
  const chatbotIcon = document.getElementById("chatbot-icon");
  const chatbotWindow = document.getElementById("chatbot-window");
  const closeChatbot = document.getElementById("close-chatbot");
  const clearChatBtn = document.getElementById("clear-chat");
  const chatbotBody = document.getElementById("chatbot-body");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotSend = document.getElementById("chatbot-send");
  const typingIndicator = document.getElementById("typing-indicator");

  let isTyping = false;

  chatbotIcon.addEventListener("click", () => {
    chatbotWindow.classList.toggle("active");
  });

  closeChatbot.addEventListener("click", () => {
    chatbotWindow.classList.remove("active");
  });

  clearChatBtn.addEventListener("click", () => {
    const messages = chatbotBody.querySelectorAll(".chat-message:not(.bot:first-child)");
    messages.forEach((msg) => msg.remove());
  });

  const chatbotResponses = {
    halo: "Halo! Saya asisten AI Abyan. Ada yang bisa saya bantu hari ini? Anda bisa tanya soal proyek IoT saya, pendidikan, atau pengalaman kerja.",
    "siapa kamu": "Saya adalah asisten AI yang diprogram khusus untuk merepresentasikan Abyan Maheswara. Saya tahu banyak hal tentang hobi ngoprek robotika-nya!",
    keahlian: "Abyan jago di beberapa bidang teknik: \n- **Software**: HTML, CSS, JavaScript, C++, Python.\n- **Hardware**: Arduino, ESP32/ESP8266, Raspberry Pi.\n- **Otomasi**: Sistem kontrol PLC, sensorika, dan mekatronika.",
    pendidikan: "Abyan kuliah di **Politeknik Manufaktur Bandung (POLMAN)**, jurusan Teknik Otomasi Manufaktur dan Mekatronika. IPK-nya mantap dan dia aktif di kegiatan robotika!",
    proyek:
      "Ada beberapa proyek unggulan yang bisa saya jelaskan:\n1. **Robot Line Follower**: Robot dengan 14 sensor.\n2. **Pakan Kucing IoT**: Bisa kasih makan kucing dari HP.\n3. **FactoryForge**: Dashboard manajemen industri modern.\n4. **BanaSnap**: Deteksi pisang pakai AI.\nMau bahas yang mana?",
    "line follower": "Robot Line Follower Abyan pakai 14 sensor lho! Pakai algoritma PID biar jalannya mulus banget pas ngetrack garis.",
    "pakan kucing": "Proyek 'Pakan Kucing Otomatis' ini pakai ESP8266. Abang bisa kontrol jadwal makan kucing lewat aplikasi web dari mana saja.",
    factoryforge: "FactoryForge itu proyek web industri yang serius. Pakai Next.js, TypeScript, dan Supabase buat database-nya. Ada sistem Tenant dan manajemen inventaris.",
    banasnap: "BanaSnap itu aplikasi Flutter yang pakai Teachable Machine buat deteksi apakah pisang itu mentah, matang, atau busuk secara instan.",
    "kurnia asih": "LMS PSAA Kurnia Asih itu sistem manajemen asrama yang Abyan bikin pakai CodeIgniter 4. Membantu banget buat digitalisasi data anak asuh.",
    kontak: "Abang bisa hubungi Abyan lewat formulir di website ini, atau langsung ke LinkedIn-nya yang ada di footer. Dia suka diajak kolaborasi proyek IoT!",
    "terima kasih": "Sama-sama! Senang bisa membantu Anda mengenal Abyan lebih jauh. Ada pesan lain?",
    lokasi: "Abyan domisili di Bandung, tapi siap banget buat kerja remote atau on-site kalau ada tantangan seru.",
    default: "Wah, saya belum belajar soal itu. Coba tanyakan hal lain seperti 'Apa itu FactoryForge?' atau 'Abyan kuliah di mana?'",
  };

  const addMessage = (text, sender) => {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    chatbotBody.insertBefore(messageDiv, typingIndicator);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  };

  const showTyping = (show) => {
    if (show) {
      typingIndicator.classList.add("active");
    } else {
      typingIndicator.classList.remove("active");
    }
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  };

  const getBotResponse = (input) => {
    const userInput = input.toLowerCase();

    // API Mode Simulation (If user types 'activate pro mode')
    if (userInput.includes("activate pro mode")) {
      return "⚠️ **PRO MODE DETECTED** ⚠️\nMode AI nyata (Gemini/GPT) bisa diaktifkan dengan menghubungkan API Key di backend. Untuk sekarang, saya tetap asisten simulasi yang paling keren!";
    }

    for (const key in chatbotResponses) {
      if (userInput.includes(key)) {
        return chatbotResponses[key];
      }
    }
    return chatbotResponses.default;
  };

  const sendMessage = () => {
    const userInput = chatbotInput.value.trim();
    if (userInput === "" || isTyping) return;

    addMessage(userInput, "user");
    chatbotInput.value = "";
    isTyping = true;

    // Simulate Bot Thinking & Typing
    setTimeout(() => {
      showTyping(true);

      const response = getBotResponse(userInput);
      const typingTime = Math.min(Math.max(response.length * 20, 1000), 3000);

      setTimeout(() => {
        showTyping(false);
        addMessage(response, "bot");
        isTyping = false;
      }, typingTime);
    }, 500);
  };

  chatbotSend.addEventListener("click", sendMessage);
  chatbotInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  // Back to Top Button Functionality
  const backToTopBtn = document.getElementById("back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add("active");
      } else {
        backToTopBtn.classList.remove("active");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
});
