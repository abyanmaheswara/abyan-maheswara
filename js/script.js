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
});
