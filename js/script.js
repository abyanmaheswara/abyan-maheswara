document.addEventListener('DOMContentLoaded', () => {

    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
    });

    // GSAP Animations
    const tl = gsap.timeline();
    tl.from('.hero-title', { duration: 1, y: 50, opacity: 0, ease: 'power3.out' })
      .from('.hero-subtitle', { duration: 1, y: 50, opacity: 0, ease: 'power3.out' }, '-=0.8')
      .from('nav', { duration: 1, y: -100, opacity: 0, ease: 'power3.out' }, '-=1');

    // Three.js Background
    let scene, camera, renderer, cube;

    function initThree() {
        const canvas = document.getElementById('bg-canvas');
        
        // Scene
        scene = new THREE.Scene();

        // Camera
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Object
        const geometry = new THREE.IcosahedronGeometry(1, 0);
        const material = new THREE.MeshBasicMaterial({ color: 0x00aaff, wireframe: true });
        cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        animate();
    }

    function animate() {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.002;
        cube.rotation.y += 0.002;

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize, false);

    initThree();

    // Hamburger Menu Functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        // Animate Links
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('toggle');
    });

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('toggle');
        });
    });

    // Project Modal Functionality
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.getAttribute('data-title');
            const image = card.getAttribute('data-image');
            const description = card.getAttribute('data-description');

            modalImg.src = image;
            modalTitle.textContent = title;
            modalDescription.textContent = description;

            modal.classList.add('active');
        });
    });

    const hideModal = () => {
        modal.classList.remove('active');
    };

    closeModal.addEventListener('click', hideModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });

    // Blog Modal Functionality
    const blogCards = document.querySelectorAll('.blog-card');
    const blogModal = document.getElementById('blog-modal');
    const closeBlogModal = blogModal.querySelector('.close-modal');
    const blogModalContent = document.getElementById('blog-modal-content');

    blogCards.forEach(card => {
        const readMoreBtn = card.querySelector('.read-more');
        readMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const postId = card.getAttribute('data-post-id');
            const postContent = document.getElementById(`${postId}-content`);

            if (postContent) {
                blogModalContent.innerHTML = ''; // Clear previous content
                const clonedContent = postContent.cloneNode(true);
                clonedContent.style.display = 'block'; // Make the cloned content visible
                blogModalContent.appendChild(clonedContent);
                blogModal.classList.add('active');
            }
        });
    });

    const hideBlogModal = () => {
        blogModal.classList.remove('active');
        blogModalContent.innerHTML = ''; // Clear content when closing
    };

    closeBlogModal.addEventListener('click', hideBlogModal);
    blogModal.addEventListener('click', (e) => {
        if (e.target === blogModal) {
            hideBlogModal();
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

            const scrollerInner = scroller.querySelector('.scroller__inner');
            const scrollerContent = Array.from(scrollerInner.children);

            scrollerContent.forEach(item => {
                const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute('aria-hidden', true);
                scrollerInner.appendChild(duplicatedItem);
            });
        });
    }

    // Contact Form Submission
    const form = document.querySelector('#contact form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const status = document.createElement('p');
        try {
            const response = await fetch(form.action, {
                method: form.method,
                body: new FormData(form),
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                status.textContent = "Terima kasih! Pesan Anda telah terkirim.";
                status.style.color = 'green';
                form.reset();
            } else {
                status.textContent = "Oops! Terjadi masalah saat mengirim pesan Anda.";
                status.style.color = 'red';
            }
        } catch (error) {
            status.textContent = "Oops! Terjadi masalah saat mengirim pesan Anda.";
            status.style.color = 'red';
        }

        form.appendChild(status);
        setTimeout(() => {
            status.remove();
        }, 5000);
    });

        setTimeout(() => {
            status.remove();
        }, 5000);
    });

    // Theme Toggle Functionality
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-theme');
            themeToggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-sun-fill" viewBox="0 0 16 16"><path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 0-.707.707l1.414 1.414a.5.5 0 0 0 .707 0zM4.464 4.465a.5.5 0 0 0-.707 0L2.343 3.05a.5.5 0 1 0-.707.707l1.414 1.414a.5.5 0 0 0 .707 0z"/></svg>';
        } else {
            body.classList.remove('light-theme');
            themeToggleBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-moon-fill" viewBox="0 0 16 16"><path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.732 16 0 12.28 0 7.71 0 4.272 2.134 1.57 5.124.66A.757.757 0 0 1 6 .278z"/></svg>';
        }
    };

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark.matches) {
        applyTheme('dark'); // Default to dark if system prefers dark
    } else {
        applyTheme('dark'); // Default to dark if no preference (current theme)
    }

    themeToggleBtn.addEventListener('click', () => {
        let currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
        let newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // AI Chatbot Functionality
    const chatbotIcon = document.getElementById('chatbot-icon');
    const chatbotWindow = document.getElementById('chatbot-window');
    const closeChatbot = document.getElementById('close-chatbot');
    const chatbotBody = document.getElementById('chatbot-body');
    const chatbotInput = document.getElementById('chatbot-input');
    const chatbotSend = document.getElementById('chatbot-send');

    chatbotIcon.addEventListener('click', () => {
        chatbotWindow.classList.toggle('active');
    });

    closeChatbot.addEventListener('click', () => {
        chatbotWindow.classList.remove('active');
    });

    const chatbotResponses = {
        "halo": "Halo! Ada yang bisa saya bantu?",
        "siapa kamu": "Saya adalah asisten AI Abyan. Saya bisa menjawab pertanyaan tentang Abyan, proyeknya, dan keahliannya.",
        "keahlian": "Abyan memiliki keahlian dalam HTML, CSS, JavaScript, Arduino, C++, ESP, dan Raspberry Pi. Dia sangat tertarik pada IoT, Robotika, dan Otomasi.",
        "skill": "Abyan memiliki keahlian dalam HTML, CSS, JavaScript, Arduino, C++, ESP, dan Raspberry Pi. Dia sangat tertarik pada IoT, Robotika, dan Otomasi.",
        "pendidikan": "Abyan saat ini menempuh pendidikan di Politeknik Manufaktur Bandung, jurusan Teknik Otomasi Manufaktur dan Mekatronika, program studi D4 Teknologi Rekayasa Informatika Industri.",
        "kuliah": "Abyan saat ini menempuh pendidikan di Politeknik Manufaktur Bandung, jurusan Teknik Otomasi Manufaktur dan Mekatronika, program studi D4 Teknologi Rekayasa Informatika Industri.",
        "proyek": "Abyan telah mengerjakan beberapa proyek menarik, seperti Robot Line Follower, Pakan Kucing Otomatis berbasis IoT, dan Tempat Sampah Otomatis. Anda bisa melihat detailnya di bagian Proyek.",
        "project": "Abyan telah mengerjakan beberapa proyek menarik, seperti Robot Line Follower, Pakan Kucing Otomatis berbasis IoT, dan Tempat Sampah Otomatis. Anda bisa melihat detailnya di bagian Proyek.",
        "kontak": "Anda bisa menghubungi Abyan melalui formulir kontak di bagian bawah halaman ini, atau melalui Instagram, LinkedIn, dan GitHub yang linknya ada di footer.",
        "contact": "Anda bisa menghubungi Abyan melalui formulir kontak di bagian bawah halaman ini, atau melalui Instagram, LinkedIn, dan GitHub yang linknya ada di footer.",
        "terima kasih": "Sama-sama! Senang bisa membantu.",
        "default": "Maaf, saya belum mengerti pertanyaan itu. Coba tanyakan hal lain tentang Abyan."
    };

    const sendMessage = () => {
        const userInput = chatbotInput.value.trim();
        if (userInput === '') return;

        // Display user message
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.innerHTML = `<p>${userInput}</p>`;
        chatbotBody.appendChild(userMessageDiv);

        // Get bot response
        let botResponse = chatbotResponses.default;
        for (const key in chatbotResponses) {
            if (userInput.toLowerCase().includes(key)) {
                botResponse = chatbotResponses[key];
                break;
            }
        }

        // Display bot message
        setTimeout(() => {
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            botMessageDiv.innerHTML = `<p>${botResponse}</p>`;
            chatbotBody.appendChild(botMessageDiv);
            // Scroll to the bottom
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        }, 500);

        chatbotInput.value = '';
        // Scroll to the bottom
        chatbotBody.scrollTop = chatbotBody.scrollHeight;
    };

    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
