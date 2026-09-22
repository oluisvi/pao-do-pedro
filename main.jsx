import React, { useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const reelScenes = [
  {
    image: 'patio-arches-709',
    small: 'patio-arches-420',
    width: 709,
    position: '52% 50%',
    eyebrow: '01 · A casa',
    title: 'Terracota, verde e mesa posta.',
    body: 'A linguagem visual nasce do próprio lugar — dos arcos, da madeira, das plantas e da luz natural.'
  },
  {
    image: 'bread-hand-707',
    small: 'bread-hand-420',
    width: 707,
    position: '51% 52%',
    eyebrow: '02 · Matéria',
    title: 'Farinha. Água. Sal. Tempo.',
    body: 'Alguns pães passam de 24 horas em fermentação natural. O resultado aparece na crosta, no miolo e no aroma.'
  },
  {
    image: 'pedro-making-706',
    small: 'pedro-making-420',
    width: 706,
    position: '50% 48%',
    eyebrow: '03 · Mãos',
    title: 'Feito perto, feito à mão.',
    body: 'O processo não fica escondido atrás do produto. É parte da experiência — do preparo à mesa.'
  },
  {
    image: 'pedro-portrait-704',
    small: 'pedro-portrait-420',
    width: 704,
    position: '48% 48%',
    eyebrow: '04 · Pedro',
    title: 'Pão do Pedro. Literalmente.',
    body: 'Uma história que começou pequena e ganhou endereço, balcão, café e gente chegando para ficar.'
  },
  {
    image: 'coffee-croissants-755',
    small: 'coffee-croissants-420',
    width: 755,
    position: '50% 44%',
    eyebrow: '05 · Café',
    title: 'No fim de semana, a casa abre cedo.',
    body: 'Sábado e domingo, das 8h às 12h. Café, pão, brunch e tempo para sentar.'
  },
  {
    image: 'brunch-overhead-709',
    small: 'brunch-overhead-420',
    width: 709,
    position: '50% 42%',
    eyebrow: '06 · Mesa',
    title: 'Sente. O resto acontece aqui.',
    body: 'O pão deixa de ser produto e vira encontro — a última transformação da experiência.'
  }
 ];

const upgradedPngAssets = new Set([
  'patio-plate-756',
  'bakery-rack-531',
  'cookies-755',
  'coffee-croissants-755',
  'bread-hand-707',
  'packaging-756',
  'patio-depth-709'
]);

const galleryItems = [
  { src: 'product-plate-473', small: 'product-plate-420', width: 473, alt: 'Prato servido no Pão do Pedro', caption: 'Chega mais perto.', shape: 'tall' },
  { src: 'table-spread-445', small: 'table-spread-420', width: 445, alt: 'Mesa com pratos e café', caption: 'Mesa cheia, sem pressa.' },
  { src: 'patio-plate-756', small: 'patio-plate-420', width: 756, alt: 'Prato servido no pátio', caption: 'Do forno para a casa.', shape: 'arch' },
  { src: 'bakery-rack-531', small: 'bakery-rack-420', width: 531, alt: 'Estantes com pães e plantas', caption: 'Feito aqui.' },
  { src: 'cookies-755', small: 'cookies-420', width: 755, alt: 'Cookies artesanais do Pão do Pedro', caption: 'Doce também tem seu tempo.', shape: 'arch' },
  { src: 'coffee-croissants-755', small: 'coffee-croissants-420', width: 755, alt: 'Café e croissants sobre a mesa', caption: 'Café passado. Croissant na mesa.' },
  { src: 'bread-hand-707', small: 'bread-hand-420', width: 707, alt: 'Pão artesanal segurado em primeiro plano', caption: 'Crosta, miolo e espera.', shape: 'tall' },
  { src: 'packaging-756', small: 'packaging-420', width: 756, alt: 'Produtos embalados do Pão do Pedro', caption: 'Da casa para a sua.' },
  { src: 'patio-depth-709', small: 'patio-depth-420', width: 709, alt: 'Pátio do Pão do Pedro visto entre plantas', caption: 'Uma casa para ficar.', shape: 'arch' },
  { src: 'pedro-rack-711', small: 'pedro-rack-420', width: 711, alt: 'Pedro ao lado da estante de pães', caption: 'Pão do Pedro. Feito pelo Pedro.' }
];

function ReelExperience() {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (reduceMotion || !rootRef.current) return undefined;

    const ctx = gsap.context(() => {
      const root = rootRef.current;
      const scenes = gsap.utils.toArray('.reel__scene', root);
      const images = gsap.utils.toArray('.reel__scene img', root);
      const captions = gsap.utils.toArray('.reel__caption', root);
      const progress = root.querySelector('.reel__progress span');

      gsap.set(scenes, { autoAlpha: 0, zIndex: (i) => i + 1 });
      gsap.set(images, {
        scale: 1.055,
        yPercent: 1.2,
        clipPath: 'inset(6% 2.5% 6% 2.5% round 30px)'
      });
      gsap.set(captions, { autoAlpha: 0, y: 22 });
      gsap.set(scenes[0], { autoAlpha: 1 });
      gsap.set(images[0], { scale: 1, yPercent: 0, clipPath: 'inset(0% 0% 0% 0% round 0px)' });
      gsap.set(captions[0], { autoAlpha: 1, y: 0 });
      gsap.set(progress, { scaleY: 0, transformOrigin: '50% 0%' });

      const transitionSpan = 1;
      const total = (scenes.length - 1) * transitionSpan;
      const tl = gsap.timeline({
        defaults: { overwrite: 'auto' },
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom bottom',
          scrub: window.matchMedia('(min-width: 900px)').matches ? 1.25 : 0.72,
          invalidateOnRefresh: true,
          anticipatePin: 1
        }
      });

      if (progress) {
        tl.to(progress, { scaleY: 1, duration: total, ease: 'none' }, 0);
      }

      for (let i = 1; i < scenes.length; i += 1) {
        const at = (i - 1) * transitionSpan;
        const previous = scenes[i - 1];
        const previousImage = images[i - 1];
        const current = scenes[i];
        const currentImage = images[i];
        const previousCaption = captions[i - 1];
        const currentCaption = captions[i];

        tl.to(previousCaption, {
          autoAlpha: 0,
          y: -14,
          duration: 0.27,
          ease: 'power2.in'
        }, at + 0.04)
          .to(previousImage, {
            scale: 1.025,
            yPercent: -0.8,
            duration: 0.76,
            ease: 'power2.inOut'
          }, at)
          .to(previous, {
            autoAlpha: 0,
            duration: 0.52,
            ease: 'power2.inOut'
          }, at + 0.28)
          .fromTo(current,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.58, ease: 'power2.inOut' },
            at + 0.18
          )
          .fromTo(currentImage,
            {
              scale: 1.055,
              yPercent: 1.4,
              clipPath: 'inset(7% 3% 7% 3% round 34px)'
            },
            {
              scale: 1,
              yPercent: 0,
              clipPath: 'inset(0% 0% 0% 0% round 0px)',
              duration: 0.82,
              ease: 'power2.inOut'
            },
            at + 0.12
          )
          .fromTo(currentCaption,
            { autoAlpha: 0, y: 24 },
            { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power3.out' },
            at + 0.48
          );
      }

      const loaded = images.map((img) => {
        if (img.complete) return img.decode?.().catch(() => undefined);
        return new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        });
      });
      Promise.allSettled(loaded).then(() => ScrollTrigger.refresh());
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="reel" ref={rootRef} className="reel" aria-label="Uma visita ao Pão do Pedro">
      <div className="reel__sticky">
        <div className="reel__media-frame" aria-hidden="true">
          {reelScenes.map((scene, index) => (
            <figure className="reel__scene" data-scene={index} key={scene.image} style={{ '--pos': scene.position }}>
              <picture>
                <img
                  src={`assets/images/${scene.image}.png`}
                  alt=""
                  loading={index < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                />
              </picture>
            </figure>
          ))}
          <div className="reel__arch-outline"></div>
          <div className="reel__grain"></div>
          <div className="reel__soft-vignette"></div>
        </div>

        <div className="reel__copy" aria-live="off">
          {reelScenes.map((scene, index) => (
            <article className="reel__caption" data-caption={index} key={scene.title}>
              <p className="eyebrow">{scene.eyebrow}</p>
              <h2>{scene.title}</h2>
              <p>{scene.body}</p>
            </article>
          ))}
        </div>
        <div className="reel__progress" aria-hidden="true"><span></span></div>
      </div>
    </section>
  );
}

function GalleryFigure({ item, duplicate = false }) {
  const usesUpgradedPng = upgradedPngAssets.has(item.src);

  return (
    <figure className={`gallery__item${item.shape ? ` gallery__item--${item.shape}` : ''}`}>
      {usesUpgradedPng ? (
        <img
          src={`assets/images/${item.src}.png`}
          alt={duplicate ? '' : item.alt}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <picture>
          <source
            type="image/webp"
            srcSet={`assets/images/${item.small}.webp 420w, assets/images/${item.src}.webp ${item.width}w`}
            sizes="(min-width: 900px) 30vw, 77vw"
          />
          <img
            src={`assets/images/${item.src}.jpg`}
            alt={duplicate ? '' : item.alt}
            loading="lazy"
            decoding="async"
          />
        </picture>
      )}
      <figcaption aria-hidden={duplicate ? 'true' : undefined}>{item.caption}</figcaption>
    </figure>
  );
}

function InfiniteGallery() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const tweenRef = useRef(null);
  const userPausedRef = useRef(false);
  const [paused, setPaused] = useState(false);

  useLayoutEffect(() => {
    if (reduceMotion || !trackRef.current) return undefined;

    const ctx = gsap.context(() => {
      tweenRef.current = gsap.to(trackRef.current, {
        xPercent: -50,
        duration: window.matchMedia('(min-width: 900px)').matches ? 52 : 64,
        ease: 'none',
        repeat: -1
      });
    }, sectionRef);

    const onVisibility = () => {
      if (!tweenRef.current) return;
      if (document.hidden || userPausedRef.current) tweenRef.current.pause();
      else tweenRef.current.resume();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      ctx.revert();
    };
  }, []);

  const pause = () => tweenRef.current?.pause();
  const resume = () => { if (!userPausedRef.current) tweenRef.current?.resume(); };
  const togglePaused = () => {
    const next = !userPausedRef.current;
    userPausedRef.current = next;
    setPaused(next);
    next ? tweenRef.current?.pause() : tweenRef.current?.resume();
  };

  return (
    <section ref={sectionRef} className="gallery gallery--infinite" aria-label="Comida, café e bastidores">
      <button
        className="gallery__motion-toggle"
        type="button"
        aria-pressed={paused}
        onClick={togglePaused}
      >
        {paused ? 'Continuar' : 'Pausar'}
      </button>
      <div className="gallery__viewport" onPointerEnter={pause} onPointerLeave={resume} onFocus={pause} onBlur={resume}>
        <div className="gallery__track" ref={trackRef}>
          <div className="gallery__group">
            {galleryItems.map((item) => <GalleryFigure item={item} key={item.src} />)}
          </div>
          <div className="gallery__group" aria-hidden="true">
            {galleryItems.map((item) => <GalleryFigure item={item} duplicate key={`duplicate-${item.src}`} />)}
          </div>
        </div>
      </div>
      <p className="gallery__hint" aria-hidden="true">comida · café · bastidores · casa ·</p>
    </section>
  );
}

function setupOpenStatus() {
  const statusNode = document.querySelector('#open-status');
  const statusDot = document.querySelector('.status-dot');
  if (!statusNode || !statusDot) return () => undefined;

  const update = () => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/Sao_Paulo',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(new Date());
    const p = Object.fromEntries(parts.filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
    const mins = Number(p.hour) * 60 + Number(p.minute);
    const openBakery = ['Wed', 'Thu', 'Fri'].includes(p.weekday) && mins >= 16 * 60 && mins < 19 * 60;
    const openCafe = ['Sat', 'Sun'].includes(p.weekday) && mins >= 8 * 60 && mins < 12 * 60;
    const isOpen = openBakery || openCafe;
    statusDot.classList.toggle('is-open', isOpen);
    statusNode.textContent = isOpen ? (openCafe ? 'Café aberto agora' : 'Padaria aberta agora') : 'Fechado agora';
  };

  update();
  const timer = window.setInterval(update, 60_000);
  return () => window.clearInterval(timer);
}

function setupMenu() {
  const menuButton = document.querySelector('.menu-button');
  const menu = document.querySelector('#site-menu');
  if (!menuButton || !menu) return () => undefined;

  const setMenu = (open) => {
    menuButton.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-hidden', String(!open));
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };
  const toggle = () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true');
  const close = () => setMenu(false);
  const onKey = (event) => { if (event.key === 'Escape') close(); };

  menuButton.addEventListener('click', toggle);
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  document.addEventListener('keydown', onKey);

  return () => {
    menuButton.removeEventListener('click', toggle);
    menu.querySelectorAll('a').forEach((link) => link.removeEventListener('click', close));
    document.removeEventListener('keydown', onKey);
  };
}

function preloadImage(src) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = async () => {
      try { await image.decode?.(); } catch { /* decode is an optimization, not a gate */ }
      resolve();
    };
    image.onerror = resolve;
    image.src = src;
  });
}

async function setupThematicEntry() {
  const entry = document.querySelector('#entry');
  if (!entry) return;

  // The entrance intentionally runs on every full page load/reload.
  // Only reduced-motion users skip the cinematic opening.
  if (reduceMotion) {
    entry.classList.add('is-hidden');
    gsap.set(entry, { autoAlpha: 0 });
    return;
  }

  // Keep the finished hero completely quiet behind the entrance. This
  // prevents copy/header elements from appearing during the final zoom and
  // lets the doorway hand off to a clean photograph before UI returns.
  const heroItems = gsap.utils.toArray('.hero__content > *');
  const heroArch = document.querySelector('.hero__arch');
  const siteHeader = document.querySelector('.site-header');

  gsap.set(heroItems, { autoAlpha: 0, y: 34 });
  if (heroArch) gsap.set(heroArch, { autoAlpha: 0, scale: 0.985, transformOrigin: '50% 70%' });
  if (siteHeader) gsap.set(siteHeader, { autoAlpha: 0, y: 16 });

  const revealHero = () => {
    const reveal = gsap.timeline({ defaults: { overwrite: 'auto' } });

    // First give the real hero image a tiny beat on its own. Then bring the
    // interface back from below in a stagger, so the handoff reads as one
    // continuous scene instead of an overlay disappearing over finished UI.
    if (heroArch) {
      reveal.to(heroArch, {
        autoAlpha: 1,
        scale: 1,
        duration: 0.68,
        ease: 'power3.out'
      }, 0.06);
    }

    if (siteHeader) {
      reveal.to(siteHeader, {
        autoAlpha: 1,
        y: 0,
        duration: 0.48,
        ease: 'power3.out'
      }, 0.10);
    }

    reveal.to(heroItems, {
      autoAlpha: 1,
      y: 0,
      duration: 0.72,
      stagger: 0.085,
      ease: 'power3.out'
    }, 0.16);
  };

  // The real site is already mounted behind the entrance. We only wait
  // for the image shared by the entrance and hero, with a safety timeout.
  const readiness = Promise.all([
    preloadImage('assets/images/entry-corridor-532.png')
  ]);
  const timeout = new Promise((resolve) => window.setTimeout(resolve, 3600));
  await Promise.race([readiness, timeout]);

  entry.classList.add('is-ready');
  await new Promise((resolve) => window.setTimeout(resolve, 180));

  const doorway = entry.querySelector('.entry__doorway');
  const corridor = entry.querySelector('.entry__door-reveal img');
  const shade = entry.querySelector('.entry__door-reveal-shade');
  const leftDoor = entry.querySelector('.entry__door-leaf--left');
  const rightDoor = entry.querySelector('.entry__door-leaf--right');
  const copy = entry.querySelector('.entry__door-copy');
  const brand = entry.querySelector('.entry__door-brand');
  const wall = entry.querySelector('.entry__door-wall');

  if (!doorway || !corridor || !leftDoor || !rightDoor) {
    entry.classList.add('is-hidden');
    gsap.set(entry, { autoAlpha: 0 });
    return;
  }

  entry.classList.add('is-opening');

  gsap.set([leftDoor, rightDoor], { rotateY: 0, force3D: true });
  gsap.set(corridor, { scale: 1.065, yPercent: 0.8, force3D: true });

  const isDesktop = window.matchMedia('(min-width: 900px)').matches;
  const tl = gsap.timeline({
    defaults: { overwrite: 'auto' },
    onComplete: () => {
      entry.classList.add('is-hidden');
      gsap.set(entry, { autoAlpha: 0 });
      revealHero();
    }
  });

  // First, quiet the copy. Then the two physical leaves swing away from
  // the centre seam, revealing the actual corridor behind them.
  tl.to([copy, brand], {
    autoAlpha: 0,
    y: -10,
    duration: 0.28,
    ease: 'power2.out'
  }, 0)
    .to(leftDoor, {
      rotateY: -104,
      duration: 1.08,
      ease: 'power3.inOut'
    }, 0.10)
    .to(rightDoor, {
      rotateY: 104,
      duration: 1.08,
      ease: 'power3.inOut'
    }, 0.10)
    .to(corridor, {
      scale: 1,
      yPercent: 0,
      duration: 1.18,
      ease: 'power3.out'
    }, 0.08)
    .to(shade, {
      opacity: 0.08,
      duration: 0.70,
      ease: 'power2.out'
    }, 0.42);

  if (isDesktop) {
    // Desktop doorway already shares the hero's image footprint: once the
    // doors are open, dissolve the terracotta wall into the existing hero.
    tl.to(wall, {
      autoAlpha: 0,
      duration: 0.58,
      ease: 'power2.out'
    }, 0.92)
      .to(entry, {
        autoAlpha: 0,
        duration: 0.46,
        ease: 'power2.out'
      }, 1.16);
  } else {
    // On mobile the hero image is full viewport. Let the opened doorway
    // become the viewport itself before handing control to the page.
    tl.to(doorway, {
      width: '106vw',
      height: '106svh',
      borderRadius: '0px',
      duration: 0.72,
      ease: 'power3.inOut'
    }, 0.92)
      .to(wall, {
        autoAlpha: 0,
        duration: 0.48,
        ease: 'power2.out'
      }, 1.02)
      .to(entry, {
        autoAlpha: 0,
        duration: 0.34,
        ease: 'power2.out'
      }, 1.40);
  }
}
function setupAmbientMotion() {
  if (reduceMotion) return () => undefined;

  const ctx = gsap.context(() => {
    gsap.utils.toArray('.story__media img, .visit__image-wrap img').forEach((image) => {
      gsap.fromTo(image,
        { scale: 1.035 },
        {
          scale: 1,
          duration: 1.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: image, start: 'top 88%', once: true }
        }
      );
    });

    const mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', () => {
      const heroImage = document.querySelector('.hero__image img');
      const manifestoNumber = document.querySelector('.manifesto__number');
      const houseImage = document.querySelector('.house__image img');

      if (heroImage) {
        // Start from the exact CSS/entrance handoff frame. A fromTo here used
        // to force scale: 1.035 before the entrance had finished fading,
        // which produced the visible post-entry zoom snap.
        gsap.to(heroImage, {
          scale: 1.018,
          yPercent: 2.5,
          ease: 'none',
          scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
        });
      }
      if (manifestoNumber) {
        gsap.fromTo(manifestoNumber, { xPercent: -2.5 }, {
          xPercent: 1.5,
          ease: 'none',
          scrollTrigger: { trigger: '.manifesto', start: 'top bottom', end: 'bottom top', scrub: 1.2 }
        });
      }
      if (houseImage) {
        gsap.fromTo(houseImage, { scale: 1.045 }, {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.house', start: 'top bottom', end: 'bottom top', scrub: 1.15 }
        });
      }
    });
  });

  return () => ctx.revert();
}

const reelRoot = document.querySelector('#reel-react-root');
if (reelRoot) createRoot(reelRoot).render(<ReelExperience />);

const galleryRoot = document.querySelector('#gallery-react-root');
if (galleryRoot) createRoot(galleryRoot).render(<InfiniteGallery />);

const cleanups = [setupOpenStatus(), setupMenu(), setupAmbientMotion()];
setupThematicEntry();

window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
window.addEventListener('beforeunload', () => cleanups.forEach((cleanup) => cleanup?.()), { once: true });
