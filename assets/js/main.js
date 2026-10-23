/* ============================================
   INDEEP CLEANING ID — Landing Page Conversion
   Vanilla JS. Tanpa framework, tanpa library.
   ============================================ */

(function () {
    'use strict';

    /* ------------------------------------------
       1. Before/After Slider
       Pakai Pointer Event supaya mouse, touch,
       dan pena cukup satu jalur kode.

       Divider bergerak relatif terhadap posisi
       awal, jadi tap atau sentuhan singkat tidak
       menggeser foto. Cuma drag sungguhan yang
       mengubah tampilan.
       ------------------------------------------ */
    function initSlider(slider) {
        var afterImg = slider.querySelector('.ba-image-after');
        var divider = slider.querySelector('.ba-divider');
        var handle = slider.querySelector('.ba-handle');

        if (!afterImg || !divider || !handle) return;

        // Jarak minimal agar gesture dianggap drag. Dipakai 3 persen dari
        // lebar slider, supaya gesture singkat yang kecil selalu diabaikan
        // baik di layar kecil maupun besar.
        var DRAG_THRESHOLD_RATIO = 0.03;
        var DRAG_THRESHOLD_MIN = 6;

        var dragging = false;
        var hasMoved = false;
        var startX = 0;
        var startPercent = 50;
        var threshold = DRAG_THRESHOLD_MIN;

        // Posisi divider sekarang, 50 persen kalau belum pernah digeser
        function currentPercent() {
            var value = parseFloat(divider.style.left);
            return isNaN(value) ? 50 : value;
        }

        function moveTo(percent) {
            // Batasi antara 0 sampai 100
            if (percent < 0) percent = 0;
            if (percent > 100) percent = 100;

            // Potong sisi kiri sebesar percent, supaya foto after selalu
            // tampil di sebelah kanan divider dan foto before di sebelah kiri.
            // Rumus ini harus sama dengan nilai awal di style.css,
            // yaitu inset(0 0 0 50 persen).
            afterImg.style.clipPath = 'inset(0 0 0 ' + percent + '%)';
            divider.style.left = percent + '%';
            handle.style.left = percent + '%';
        }

        slider.addEventListener('pointerdown', function (event) {
            dragging = true;
            hasMoved = false;
            startX = event.clientX;
            startPercent = currentPercent();
            threshold = Math.max(DRAG_THRESHOLD_MIN,
                slider.getBoundingClientRect().width * DRAG_THRESHOLD_RATIO);

            try {
                slider.setPointerCapture(event.pointerId);
            } catch (err) {
                // Beberapa browser menolak capture kalau pointer sudah tidak aktif
            }

            // Sengaja tidak memindahkan divider di sini.
            // Kalau dipindah, tap atau sentuhan singkat langsung
            // menukar tampilan tanpa disengaja.
            event.preventDefault();
        });

        slider.addEventListener('pointermove', function (event) {
            if (!dragging) return;

            var delta = event.clientX - startX;

            // Gesture terlalu kecil diabaikan, hanya drag sungguhan yang dihitung
            if (!hasMoved) {
                if (Math.abs(delta) < threshold) return;
                hasMoved = true;
            }

            var rect = slider.getBoundingClientRect();
            var percent = startPercent + (delta / rect.width) * 100;

            moveTo(percent);
        });

        function endDrag(event) {
            if (!dragging) return;

            dragging = false;
            hasMoved = false;

            try {
                if (slider.hasPointerCapture(event.pointerId)) {
                    slider.releasePointerCapture(event.pointerId);
                }
            } catch (err) {
                // Diabaikan, pointer sudah tidak di-capture
            }
        }

        slider.addEventListener('pointerup', endDrag);
        slider.addEventListener('pointercancel', endDrag);

        // Cegah draggable bawaan browser saat gambar disentuh
        slider.addEventListener('dragstart', function (event) {
            event.preventDefault();
        });
    }

    function initSliders() {
        var sliders = document.querySelectorAll('.ba-slider');
        Array.prototype.forEach.call(sliders, initSlider);
    }

    /* ------------------------------------------
       2. Scroll Reveal
       Element muncul saat masuk viewport.
       ------------------------------------------ */
    function initReveal() {
        var targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');

        if (!('IntersectionObserver' in window)) {
            Array.prototype.forEach.call(targets, function (el) {
                el.classList.add('revealed');
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        Array.prototype.forEach.call(targets, function (el) {
            observer.observe(el);
        });
    }

    /* ------------------------------------------
       3. FAQ Accordion
       Satu pertanyaan terbuka pada satu waktu.
       ------------------------------------------ */
    function initFaq() {
        var items = document.querySelectorAll('.faq-item');

        Array.prototype.forEach.call(items, function (item) {
            var button = item.querySelector('.faq-question');
            if (!button) return;

            button.addEventListener('click', function () {
                var isOpen = item.classList.contains('open');

                // Tutup semua dulu, baru buka yang diklik
                Array.prototype.forEach.call(items, function (other) {
                    other.classList.remove('open');
                    var otherButton = other.querySelector('.faq-question');
                    if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
                });

                if (!isOpen) {
                    item.classList.add('open');
                    button.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    /* ------------------------------------------
       4. Mobile Sticky CTA
       Muncul setelah hero keluar layar.
       ------------------------------------------ */
    function initStickyCta() {
        var sticky = document.querySelector('.sticky-cta');
        var hero = document.querySelector('#hero');

        if (!sticky || !hero) return;

        if (!('IntersectionObserver' in window)) {
            sticky.classList.add('visible');
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    sticky.classList.remove('visible');
                } else {
                    sticky.classList.add('visible');
                }
            });
        }, { threshold: 0 });

        observer.observe(hero);
    }

    /* ------------------------------------------
       5. Scroll halus ke anchor
       ------------------------------------------ */
    function initSmoothScroll() {
        var links = document.querySelectorAll('a[href^="#"]');

        Array.prototype.forEach.call(links, function (link) {
            link.addEventListener('click', function (event) {
                var targetId = link.getAttribute('href');
                if (!targetId || targetId === '#') return;

                var target = document.querySelector(targetId);
                if (!target) return;

                event.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }

    /* ------------------------------------------
       6. Carousel
       Dipakai trust strip dan social proof strip.
       Auto play, bisa di drag, loop mulus.
       ------------------------------------------ */
    function initCarousel(root) {
        var track = root.querySelector('[data-carousel-track]');
        var dotsWrap = root.querySelector('[data-carousel-dots]');

        if (!track || !dotsWrap) return;

        var slides = Array.prototype.slice.call(track.querySelectorAll('[data-carousel-slide]'));
        if (slides.length < 2) return;

        var interval = parseInt(root.getAttribute('data-carousel-interval'), 10) || 0;
        var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var wideScreen = window.matchMedia('(min-width: 768px)');

        // Clone slide pertama supaya loop pergantian tidak kelihatan melompat
        var clone = slides[0].cloneNode(true);
        clone.classList.add('carousel-clone');
        clone.setAttribute('aria-hidden', 'true');
        clone.removeAttribute('data-carousel-slide');
        track.appendChild(clone);

        var allSlides = slides.concat([clone]);
        var total = slides.length;
        var index = 0;
        var timer = null;
        var restartTimer = null;
        var settleTimer = null;
        var isVisible = false;
        var dragging = false;
        var pointerId = null;
        var startX = 0;
        var startScroll = 0;
        var startIndex = 0;

        // Titik navigasi
        var dots = [];
        for (var i = 0; i < total; i++) {
            (function (target) {
                var dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'carousel-dot';
                dot.setAttribute('aria-label', 'Tampilkan poin ' + (target + 1) + ' dari ' + total);
                dot.addEventListener('click', function () {
                    goTo(target);
                    restart();
                });
                dotsWrap.appendChild(dot);
                dots.push(dot);
            })(i);
        }

        function updateDots() {
            // Saat animasi ke clone, index bernilai total (di luar jangkauan dots).
            // Pakai indeks yang sudah dijepit supaya dot terakhir tetap menyala.
            var active = Math.min(index, dots.length - 1);

            for (var i = 0; i < dots.length; i++) {
                dots[i].classList.toggle('active', i === active);
                dots[i].setAttribute('aria-current', i === active ? 'true' : 'false');
            }
        }

        function centerOf(slide) {
            return slide.offsetLeft + slide.offsetWidth / 2;
        }

        // Slide yang paling dekat dengan tengah layar
        function currentIndex() {
            var middle = track.scrollLeft + track.clientWidth / 2;
            var best = 0;
            var bestDistance = Infinity;

            for (var i = 0; i < allSlides.length; i++) {
                var distance = Math.abs(centerOf(allSlides[i]) - middle);
                if (distance < bestDistance) {
                    bestDistance = distance;
                    best = i;
                }
            }

            return best;
        }

        function scrollToSlide(i, behavior) {
            var slide = allSlides[i];
            if (!slide) return;
            var left = centerOf(slide) - track.clientWidth / 2;
            track.scrollTo({ left: left, behavior: behavior || 'smooth' });
        }

        function goTo(i) {
            index = i;
            scrollToSlide(i, 'smooth');
            updateDots();
        }

        // Dipanggil setelah scroll berhenti
        function settle() {
            var current = currentIndex();

            if (current === total) {
                // Sedang di clone, lompat balik ke slide pertama tanpa animasi
                track.scrollTo({ left: centerOf(slides[0]) - track.clientWidth / 2, behavior: 'auto' });
                current = 0;
            }

            index = current;
            updateDots();
        }

        function next() {
            var target = index + 1;

            if (target >= total) {
                // Geser ke clone, setelah itu settle() mengembalikan ke slide pertama
                index = total;
                scrollToSlide(total, 'smooth');
            } else {
                index = target;
                scrollToSlide(target, 'smooth');
            }

            updateDots();
        }

        function play() {
            stop();
            if (!interval || reducedMotion || wideScreen.matches || !isVisible) return;
            timer = setInterval(next, interval);
        }

        function stop() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        }

        // Mulai lagi setelah user selesai berinteraksi
        function restart() {
            stop();
            if (restartTimer) clearTimeout(restartTimer);
            restartTimer = setTimeout(play, 2500);
        }

        track.addEventListener('scroll', function () {
            if (settleTimer) clearTimeout(settleTimer);
            settleTimer = setTimeout(settle, 140);
        }, { passive: true });

        // Drag dengan mouse. Swipe di touch ditangani scroll native browser
        track.addEventListener('pointerdown', function (event) {
            // Hentikan auto play untuk semua jenis pointer. Kalau ini sentuhan,
            // auto play tetap harus berhenti selama jari menyentuh layar, lalu
            // dilanjutkan lagi oleh pointerup atau pointercancel.
            stop();

            if (event.pointerType === 'touch') return;

            dragging = true;
            pointerId = event.pointerId;
            startX = event.clientX;
            startScroll = track.scrollLeft;
            startIndex = currentIndex();
            track.classList.add('is-dragging');

            try {
                track.setPointerCapture(pointerId);
            } catch (err) {
                // Pointer sudah tidak aktif, biarkan saja
            }
        });

        track.addEventListener('pointermove', function (event) {
            if (!dragging || event.pointerId !== pointerId) return;
            track.scrollLeft = startScroll - (event.clientX - startX);
        });

        function endDrag(event) {
            if (!dragging) return;
            dragging = false;
            track.classList.remove('is-dragging');

            try {
                if (track.hasPointerCapture(pointerId)) {
                    track.releasePointerCapture(pointerId);
                }
            } catch (err) {
                // Diabaikan
            }

            // Drag cukup jauh berarti pindah satu slide, bukan cuma geser sedikit
            var distance = event.clientX - startX;
            var threshold = track.clientWidth * 0.15;

            if (Math.abs(distance) > threshold) {
                var target = distance < 0 ? startIndex + 1 : startIndex - 1;

                if (target < 0) target = 0;
                if (target > total) target = total;

                index = target;
                scrollToSlide(target, 'smooth');
                updateDots();
            }

            restart();
        }

        track.addEventListener('pointerup', function (event) {
            if (event.pointerType === 'touch') {
                // Swipe sentuh: tidak ada drag manual, cukup lanjutkan auto play
                restart();
                return;
            }
            endDrag(event);
        });
        track.addEventListener('pointercancel', function (event) {
            if (event.pointerType === 'touch') {
                // Gesture sentuh dibatalkan browser, misalnya karena scroll
                // vertikal mengambil alih. Auto play tetap harus dilanjutkan,
                // kalau tidak carousel berhenti sampai disentuh lagi.
                restart();
                return;
            }
            endDrag(event);
        });

        // Cegah drag gambar bawaan browser mengganggu drag carousel
        track.addEventListener('dragstart', function (event) {
            event.preventDefault();
        });

        // Jeda saat di hover atau saat ada fokus di dalam carousel
        root.addEventListener('mouseenter', stop);
        root.addEventListener('mouseleave', play);
        root.addEventListener('focusin', stop);
        root.addEventListener('focusout', play);

        // Auto play hanya jalan saat carousel terlihat di layar
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    isVisible = entry.isIntersecting;
                    if (isVisible) {
                        play();
                    } else {
                        stop();
                    }
                });
            }, { threshold: 0.35 });

            observer.observe(root);
        } else {
            isVisible = true;
            play();
        }

        // Layout desktop tidak memakai carousel, auto play dimatikan
        if (wideScreen.addEventListener) {
            wideScreen.addEventListener('change', function () {
                if (wideScreen.matches) {
                    stop();
                } else {
                    play();
                }
            });
        }

        updateDots();
    }

    function initCarousels() {
        var roots = document.querySelectorAll('[data-carousel]');
        Array.prototype.forEach.call(roots, initCarousel);
    }

    /* ------------------------------------------
       7. Navbar
       Toggle hamburger (2 garis jadi X), tutup
       menu saat link navigasi diklik, saat
       menekan Escape, atau saat klik di luar menu.
       ------------------------------------------ */
    function initNav() {
        var nav = document.querySelector('.lp-nav');
        var burger = document.querySelector('.lp-nav-burger');
        if (!nav || !burger) return;

        function setOpen(open) {
            nav.classList.toggle('open', open);
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
            burger.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');

            // Fokus pindah ke tombol saat menu ditutup lewat Escape,
            // supaya pengguna keyboard tidak kehilangan posisi.
            if (!open && nav.contains(document.activeElement) &&
                document.activeElement !== burger) {
                burger.focus();
            }
        }

        burger.addEventListener('click', function () {
            setOpen(!nav.classList.contains('open'));
        });

        var links = nav.querySelectorAll('.lp-nav-menu a');
        Array.prototype.forEach.call(links, function (link) {
            link.addEventListener('click', function () {
                setOpen(false);
            });
        });

        // Escape menutup menu
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && nav.classList.contains('open')) {
                setOpen(false);
            }
        });

        // Klik di luar navbar menutup menu. Sengaja memakai pointerdown
        // supaya geser (scroll) di area luar tidak ikut menutup menu.
        document.addEventListener('pointerdown', function (event) {
            if (!nav.classList.contains('open')) return;
            if (nav.contains(event.target)) return;
            setOpen(false);
        });
    }

    /* ------------------------------------------
       Jalankan semua
       ------------------------------------------ */
    function init() {
        initSliders();
        initReveal();
        initFaq();
        initStickyCta();
        /* initNav sebelum initSmoothScroll supaya saat link menu diklik,
           panel menu tertutup dulu sebelum posisi target scroll dihitung.
           Kalau kebalik, target dihitung saat menu masih terbuka dan
           scroll berhenti meleset sekitar tinggi panel menu. */
        initNav();
        initSmoothScroll();
        initCarousels();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
