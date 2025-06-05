document.addEventListener("DOMContentLoaded", () => {
    // Efeito 3D na imagem de perfil
    const profileImage = document.getElementById("profile-image")
    const profileContainer = document.querySelector(".profile-image-container")

    if (profileContainer && profileImage) {
        profileContainer.addEventListener("mousemove", function (e) {
            const { left, top, width, height } = this.getBoundingClientRect()
            const x = (e.clientX - left) / width - 0.5
            const y = (e.clientY - top) / height - 0.5

            profileImage.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${y * -10}deg) scale3d(1.05, 1.05, 1.05)`
        })

        profileContainer.addEventListener("mouseleave", () => {
            profileImage.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)"
        })
    }

    // Sistema de partículas
    const canvas = document.getElementById("particles-canvas")
    if (canvas) {
        const ctx = canvas.getContext("2d")
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const particlesArray = []
        const numberOfParticles = 50

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
                this.size = Math.random() * 3 + 1
                this.speedX = Math.random() * 1 - 0.5
                this.speedY = Math.random() * 1 - 0.5
                this.color = `rgba(255, ${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 50)}, ${Math.random() * 0.3 + 0.2})`
            }

            update() {
                this.x += this.speedX
                this.y += this.speedY

                if (this.x > canvas.width) this.x = 0
                else if (this.x < 0) this.x = canvas.width
                if (this.y > canvas.height) this.y = 0
                else if (this.y < 0) this.y = canvas.height
            }

            draw() {
                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.fillStyle = this.color
                ctx.fill()
            }
        }

        function init() {
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle())
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update()
                particlesArray[i].draw()
            }

            connectParticles()
            requestAnimationFrame(animate)
        }

        function connectParticles() {
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    const dx = particlesArray[a].x - particlesArray[b].x
                    const dy = particlesArray[a].y - particlesArray[b].y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < 100) {
                        const opacity = 1 - distance / 100
                        ctx.strokeStyle = `rgba(255, 50, 50, ${opacity * 0.2})`
                        ctx.lineWidth = 1
                        ctx.beginPath()
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
                        ctx.stroke()
                    }
                }
            }
        }

        window.addEventListener("resize", () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        })

        init()
        animate()
    }

    // Carrossel de vídeos
    const videoUrls = [
        "https://www.youtube.com/embed/W2Q7jMVbw-s",
        "https://www.youtube.com/embed/WpzbqiLTM2c",
        "https://www.youtube.com/embed/YxGYumo6tpU",
        "https://www.youtube.com/embed/BncbsTBsITI",
        "https://www.youtube.com/embed/9v5f5VSuQJQ",
    ]

    let currentVideoIndex = 0
    const videoContainer = document.querySelector(".video-container")
    const prevBtn = document.querySelector(".prev-btn")
    const nextBtn = document.querySelector(".next-btn")
    const dots = document.querySelectorAll(".dot")

    if (videoContainer && prevBtn && nextBtn) {
        function updateVideo() {
            videoContainer.innerHTML = `
                  <iframe width="100%" height="215" src="${videoUrls[currentVideoIndex]}"
                      title="YouTube video player" frameborder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen>
                  </iframe>
              `

            // Atualizar dots
            dots.forEach((dot, index) => {
                dot.classList.toggle("active", index === currentVideoIndex)
            })
        }

        prevBtn.addEventListener("click", () => {
            currentVideoIndex = (currentVideoIndex - 1 + videoUrls.length) % videoUrls.length
            updateVideo()
        })

        nextBtn.addEventListener("click", () => {
            currentVideoIndex = (currentVideoIndex + 1) % videoUrls.length
            updateVideo()
        })

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                currentVideoIndex = index
                updateVideo()
            })
        })
    }

    // Galeria de fotos
    const galleryItems = document.querySelectorAll(".gallery-item")
    const filterBtns = document.querySelectorAll(".gallery-filters .filter-btn")
    const lightboxModal = document.getElementById("lightbox-modal")
    const lightboxImage = document.getElementById("lightbox-image")
    const imageTitle = document.getElementById("image-title")
    const imageCount = document.getElementById("image-count")
    const closeModal = document.querySelectorAll(".close-modal")
    const prevImage = document.querySelector(".prev-image")
    const nextImage = document.querySelector(".next-image")

    let currentImageIndex = 0
    let filteredImages = []

    if (galleryItems.length > 0) {
        // Filtrar galeria
        filterBtns.forEach((btn) => {
            btn.addEventListener("click", function () {
                const category = this.getAttribute("data-category")

                filterBtns.forEach((b) => b.classList.remove("active"))
                this.classList.add("active")

                galleryItems.forEach((item) => {
                    if (category === "all" || item.getAttribute("data-category") === category) {
                        item.style.display = "block"
                    } else {
                        item.style.display = "none"
                    }
                })
            })
        })

        // Abrir lightbox
        galleryItems.forEach((item, index) => {
            item.addEventListener("click", function () {
                const img = this.querySelector("img")
                const category = document.querySelector(".gallery-filters .filter-btn.active").getAttribute("data-category")

                // Filtrar imagens visíveis
                filteredImages = Array.from(galleryItems).filter((item) => {
                    return category === "all" || item.getAttribute("data-category") === category
                })

                currentImageIndex = filteredImages.indexOf(this)

                lightboxImage.src = img.src
                imageTitle.textContent = img.alt
                imageCount.textContent = `${currentImageIndex + 1} de ${filteredImages.length}`

                lightboxModal.style.display = "block"
            })
        })

        // Navegação do lightbox
        if (prevImage && nextImage) {
            prevImage.addEventListener("click", () => {
                currentImageIndex = (currentImageIndex - 1 + filteredImages.length) % filteredImages.length
                updateLightbox()
            })

            nextImage.addEventListener("click", () => {
                currentImageIndex = (currentImageIndex + 1) % filteredImages.length
                updateLightbox()
            })
        }

        function updateLightbox() {
            const img = filteredImages[currentImageIndex].querySelector("img")
            lightboxImage.src = img.src
            imageTitle.textContent = img.alt
            imageCount.textContent = `${currentImageIndex + 1} de ${filteredImages.length}`
        }
    }

    // Agenda de shows
    const buyTicketBtns = document.querySelectorAll(".buy-ticket")
    const ticketModal = document.getElementById("ticket-modal")
    const ticketTitle = document.getElementById("ticket-title")
    const ticketDetails = document.querySelector(".ticket-details")

    buyTicketBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            if (this.disabled) return

            const showCard = this.closest(".show-card")
            const title = showCard.querySelector("h3").textContent
            const date = showCard.querySelector(".day").textContent + " de " + showCard.querySelector(".month").textContent
            const time = showCard.querySelector(".show-details span").textContent
            const venue = showCard.querySelector(".show-details span:nth-child(2)").textContent.replace("🕐 ", "")
            const location = showCard.querySelector(".show-details span:nth-child(3)").textContent
            const price = showCard.querySelector(".price").textContent

            ticketTitle.textContent = title
            ticketDetails.innerHTML = `
                  <p><strong>Data:</strong> ${date}</p>
                  <p><strong>Horário:</strong> ${time}</p>
                  <p><strong>Local:</strong> ${venue}</p>
                  <p><strong>Cidade:</strong> ${location}</p>
                  <p><strong>Preço:</strong> <span style="color: #4ade80; font-weight: bold;">${price}</span></p>
              `

            ticketModal.style.display = "block"
        })
    })

    // Fechar modais
    closeModal.forEach((btn) => {
        btn.addEventListener("click", function () {
            this.closest(".modal").style.display = "none"
        })
    })

    // Fechar modal clicando fora
    window.addEventListener("click", (e) => {
        if (e.target.classList.contains("modal")) {
            e.target.style.display = "none"
        }
    })

    // Animações de entrada para a timeline
    const timelineItems = document.querySelectorAll(".timeline-item")
    const statCards = document.querySelectorAll(".stat-card")

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1"
                entry.target.style.transform = "translateY(0)"
            }
        })
    }, observerOptions)

    // Observar elementos para animação
    document.querySelectorAll(".show-card, .gallery-item, .timeline-item, .stat-card").forEach((el) => {
        el.style.opacity = "0"
        el.style.transform = "translateY(30px)"
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
        observer.observe(el)
    })

    console.log("Site da MC Mari carregado com seção de biografia!")
})
