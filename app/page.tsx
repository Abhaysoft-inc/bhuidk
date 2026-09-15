"use client";

import { useEffect, useRef } from "react";
import "./landing.css";

const HERO_IMG = "/hero-image.jpg";

const MARQUEE_TEXT =
  "GEOSPATIAL GOVERNANCE ✦ LAND USE PLANNING ✦ AI POLICY ANALYTICS ✦ GIS VISUALIZATION ✦ DIGITAL TRANSFORMATION ✦ ";

export default function Home() {
  const mainRef = useRef<SVGGElement>(null);
  const secondaryRef = useRef<SVGGElement>(null);
  const dropRef = useRef<SVGGElement>(null);

  useEffect(() => {
    // Parallax intensity configuration
    const PARALLAX_INTENSITY = 0.1;
    const PARALLAX_SMOOTHNESS = 0.025;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let rafId = 0;

    function handlePointerMove(event: PointerEvent) {
      const normalizedX = event.clientX / window.innerWidth - 0.5;
      const normalizedY = event.clientY / window.innerHeight - 0.5;

      targetX = normalizedX * 180 * PARALLAX_INTENSITY;
      targetY = normalizedY * 130 * PARALLAX_INTENSITY;
    }

    function handleMouseLeave() {
      targetX = 0;
      targetY = 0;
    }

    function render() {
      currentX += (targetX - currentX) * PARALLAX_SMOOTHNESS;
      currentY += (targetY - currentY) * PARALLAX_SMOOTHNESS;

      if (mainRef.current) {
        mainRef.current.style.transform = `translate(${currentX}px, ${currentY}px)`;
      }
      if (secondaryRef.current) {
        secondaryRef.current.style.transform = `translate(${currentX * 1.55}px, ${currentY * 1.55}px)`;
      }
      if (dropRef.current) {
        dropRef.current.style.transform = `translate(${currentX * 2.15}px, ${currentY * 2.15}px)`;
      }

      rafId = requestAnimationFrame(render);
    }

    window.addEventListener("pointermove", handlePointerMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave,
      );
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="hero">
      {/* ===================================================
          HEADER
      =================================================== */}
      <header className="header">
        <a href="#" className="logo">
          <span className="logo__symbol">✦</span>
          <span>GEO-INTELLIGENCE</span>
        </a>

        <nav className="nav">
          <a href="#">REPOSITORY</a>
          <a href="#">GIS ANALYTICS</a>
          <a href="#">POLICY SIMULATOR</a>
          <a href="#">INNOVATION PORTAL</a>
        </nav>

        <button className="menu">
          <span className="menu__dot"></span>
          PLATFORM ACCESS
        </button>
      </header>

      {/* ===================================================
          BODY
      =================================================== */}
      <main className="hero__body">
        {/* ================================================
            CONTENT
        ================================================ */}
        <section className="content">
          <div className="eyebrow">
            <span></span>
            SUSTAINABLE LAND GOVERNANCE & RESEARCH
          </div>

          <h1>
            INTELLIGENT
            <br />
            LAND POLICY
          </h1>

          <p className="intro">
            Bridging geospatial governance gaps by turning vast land records,
            satellite imagery, and policy research into actionable insights for
            continuous innovation.
          </p>

          <div className="actions">
            <a href="#" className="btn btn--primary">
              EXPLORE REPOSITORY
              <span>↗</span>
            </a>

            <a href="#" className="btn btn--secondary">
              VIEW GIS MODULES
              <span>→</span>
            </a>
          </div>

          <div className="meta">
            <div className="meta__item">
              <small>CORE ENGINE</small>
              <strong>AI & GIS INTEGRATION</strong>
            </div>

            <div className="meta__item">
              <small>SECURITY</small>
              <strong>ROLE-BASED & API-READY</strong>
            </div>

            <div className="meta__item">
              <small>SCROLL TO EXPLORE</small>
              <span className="scroll-dot">
                <i></i>
              </span>
            </div>
          </div>
        </section>

        {/* ================================================
            VISUAL
        ================================================ */}
        <section className="visual" id="visual">
          <svg
            className="liquid-scene"
            viewBox="0 0 1100 850"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* MAIN BUBBLE PATH */}
              <path
                id="mainBubblePath"
                d="
                  M 305 154
                  C 430 88 638 77 781 126
                  C 906 169 978 281 961 405
                  C 945 524 858 620 735 651
                  C 631 678 558 647 494 620
                  C 434 595 380 592 322 552
                  C 247 501 204 426 218 345
                  C 231 267 258 196 305 154
                  Z
                "
              >
                <animate
                  attributeName="d"
                  dur="14s"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0; .34; .68; 1"
                  keySplines="
                    .42 0 .58 1;
                    .42 0 .58 1;
                    .42 0 .58 1
                  "
                  values="
                    M 305 154
                    C 430 88 638 77 781 126
                    C 906 169 978 281 961 405
                    C 945 524 858 620 735 651
                    C 631 678 558 647 494 620
                    C 434 595 380 592 322 552
                    C 247 501 204 426 218 345
                    C 231 267 258 196 305 154
                    Z
                    ;

                    M 286 171
                    C 411 91 626 68 792 135
                    C 922 187 966 296 949 420
                    C 929 552 829 622 722 649
                    C 614 677 541 627 478 617
                    C 405 605 345 612 297 553
                    C 242 486 192 415 218 324
                    C 241 244 244 207 286 171
                    Z
                    ;

                    M 321 142
                    C 468 78 651 91 801 145
                    C 916 186 988 301 955 430
                    C 923 551 844 634 712 656
                    C 600 674 540 650 468 611
                    C 403 575 345 592 293 533
                    C 230 462 216 380 234 309
                    C 251 240 279 170 321 142
                    Z
                    ;

                    M 305 154
                    C 430 88 638 77 781 126
                    C 906 169 978 281 961 405
                    C 945 524 858 620 735 651
                    C 631 678 558 647 494 620
                    C 434 595 380 592 322 552
                    C 247 501 204 426 218 345
                    C 231 267 258 196 305 154
                    Z
                  "
                />
              </path>

              {/* SECONDARY PATH */}
              <path
                id="secondaryBubblePath"
                d="
                  M 224 530
                  C 291 486 386 489 449 543
                  C 508 594 500 683 441 731
                  C 383 779 279 771 223 714
                  C 168 657 168 568 224 530
                  Z
                "
              >
                <animate
                  attributeName="d"
                  dur="11s"
                  begin="-3s"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0; .5; 1"
                  keySplines="
                    .42 0 .58 1;
                    .42 0 .58 1
                  "
                  values="
                    M 224 530
                    C 291 486 386 489 449 543
                    C 508 594 500 683 441 731
                    C 383 779 279 771 223 714
                    C 168 657 168 568 224 530
                    Z
                    ;

                    M 207 545
                    C 272 483 390 493 458 557
                    C 507 605 483 695 425 737
                    C 361 783 262 757 211 699
                    C 165 646 160 588 207 545
                    Z
                    ;

                    M 224 530
                    C 291 486 386 489 449 543
                    C 508 594 500 683 441 731
                    C 383 779 279 771 223 714
                    C 168 657 168 568 224 530
                    Z
                  "
                />
              </path>

              {/* SMALL DROP PATH */}
              <path
                id="dropBubblePath"
                d="
                  M 645 679
                  C 686 658 741 675 758 713
                  C 776 753 747 791 704 793
                  C 665 794 627 765 629 728
                  C 630 707 632 687 645 679
                  Z
                "
              >
                <animate
                  attributeName="d"
                  dur="8s"
                  begin="-5s"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0; .5; 1"
                  keySplines="
                    .42 0 .58 1;
                    .42 0 .58 1
                  "
                  values="
                    M 645 679
                    C 686 658 741 675 758 713
                    C 776 753 747 791 704 793
                    C 665 794 627 765 629 728
                    C 630 707 632 687 645 679
                    Z
                    ;

                    M 638 687
                    C 679 650 746 676 766 718
                    C 783 754 748 786 711 801
                    C 667 805 620 767 628 725
                    C 632 705 626 696 638 687
                    Z
                    ;

                    M 645 679
                    C 686 658 741 675 758 713
                    C 776 753 747 791 704 793
                    C 665 794 627 765 629 728
                    C 630 707 632 687 645 679
                    Z
                  "
                />
              </path>

              {/* CLIPS */}
              <clipPath id="mainBubbleClip">
                <use href="#mainBubblePath" />
              </clipPath>

              <clipPath id="secondaryBubbleClip">
                <use href="#secondaryBubblePath" />
              </clipPath>

              <clipPath id="dropBubbleClip">
                <use href="#dropBubblePath" />
              </clipPath>

              {/* MAIN LIQUID FILTER */}
              {/* <filter
                id="mainLiquidFilter"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
                colorInterpolationFilters="sRGB"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency=".008 .010"
                  numOctaves="2"
                  seed="92"
                  result="noise"
                >
                  <animate
                    attributeName="baseFrequency"
                    dur="10s"
                    repeatCount="indefinite"
                    values="
                      .008 .010;
                      .010 .008;
                      .007 .012;
                      .008 .010
                    "
                  />
                </feTurbulence>

                <feGaussianBlur
                  in="noise"
                  stdDeviation="1.35"
                  result="blurredNoise"
                />

                <feDisplacementMap
                  in="SourceGraphic"
                  in2="blurredNoise"
                  scale="86"
                  xChannelSelector="R"
                  yChannelSelector="G"
                >
                  <animate
                    attributeName="scale"
                    dur="8s"
                    repeatCount="indefinite"
                    values="
                      78;
                      94;
                      84;
                      90;
                      78
                    "
                  />
                </feDisplacementMap>

                <feColorMatrix
                  type="matrix"
                  values="
                    1.02  0     0     0  0.010
                    0     1.01  0     0  0.008
                    0     0     .96   0 -0.002
                    0     0     0     1  0
                  "
                />
              </filter> */}

              {/* EDGE-DISTORTION MASK */}
              <radialGradient
                id="mainDistortionFade"
                gradientUnits="userSpaceOnUse"
                cx="590"
                cy="385"
                r="330"
              >
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="55%" stopColor="white" stopOpacity="1" />
                <stop offset="78%" stopColor="white" stopOpacity=".52" />
                <stop offset="100%" stopColor="black" stopOpacity="0" />
              </radialGradient>

              <mask
                id="mainDistortionMask"
                maskUnits="userSpaceOnUse"
                maskContentUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="1100" height="850" fill="black" />
                <ellipse
                  cx="590"
                  cy="385"
                  rx="335"
                  ry="265"
                  fill="url(#mainDistortionFade)"
                />
              </mask>

              {/* SECONDARY FILTER */}
              {/* <filter
                id="secondaryLiquidFilter"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
                colorInterpolationFilters="sRGB"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency=".010 .009"
                  numOctaves="2"
                  seed="31"
                  result="noise"
                >
                  <animate
                    attributeName="baseFrequency"
                    dur="9s"
                    repeatCount="indefinite"
                    values="
                      .010 .009;
                      .009 .012;
                      .012 .010;
                      .010 .009
                    "
                  />
                </feTurbulence>

                <feGaussianBlur in="noise" stdDeviation="1.2" result="blur" />

                <feDisplacementMap
                  in="SourceGraphic"
                  in2="blur"
                  scale="64"
                  xChannelSelector="R"
                  yChannelSelector="B"
                >
                  <animate
                    attributeName="scale"
                    dur="7s"
                    repeatCount="indefinite"
                    values="
                      56;
                      72;
                      61;
                      56
                    "
                  />
                </feDisplacementMap>

                <feColorMatrix
                  type="matrix"
                  values="
                    1.02  0     0     0  0.010
                    0     1.01  0     0  0.008
                    0     0     .95   0 -0.002
                    0     0     0     1  0
                  "
                />
              </filter> */}

              {/* DROP FILTER */}
              {/* <filter
                id="dropLiquidFilter"
                x="-40%"
                y="-40%"
                width="180%"
                height="180%"
                colorInterpolationFilters="sRGB"
              >
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency=".014 .012"
                  numOctaves="2"
                  seed="62"
                  result="noise"
                >
                  <animate
                    attributeName="baseFrequency"
                    dur="7s"
                    repeatCount="indefinite"
                    values="
                      .014 .012;
                      .017 .010;
                      .013 .015;
                      .014 .012
                    "
                  />
                </feTurbulence>

                <feGaussianBlur in="noise" stdDeviation="1.05" result="blur" />

                <feDisplacementMap
                  in="SourceGraphic"
                  in2="blur"
                  scale="48"
                  xChannelSelector="B"
                  yChannelSelector="G"
                />

                <feColorMatrix
                  type="matrix"
                  values="
                    1.02  0     0     0  0.010
                    0     1.01  0     0  0.008
                    0     0     .95   0 -0.002
                    0     0     0     1  0
                  "
                />
              </filter> */}

              {/* GLASS EDGE GRADIENT */}
              <linearGradient id="glassStroke" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="16%" stopColor="#fffdf7" stopOpacity=".96" />
                <stop offset="28%" stopColor="#dff6ff" stopOpacity=".55" />
                <stop offset="44%" stopColor="#fff8fe" stopOpacity=".36" />
                <stop offset="60%" stopColor="#ffdff2" stopOpacity=".34" />
                <stop offset="76%" stopColor="#d8f6ff" stopOpacity=".36" />
                <stop offset="90%" stopColor="#fff7ef" stopOpacity=".70" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity=".96" />
              </linearGradient>

              {/* LIGHTING GRADIENTS */}
              <radialGradient id="mainInnerLight" cx="65%" cy="20%" r="64%">
                <stop offset="0%" stopColor="#fff8df" stopOpacity=".40" />
                <stop offset="20%" stopColor="#ffe5b9" stopOpacity=".20" />
                <stop offset="48%" stopColor="#ffd5a4" stopOpacity=".06" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>

              <linearGradient id="glassSheen" x1="0" y1="0" x2="0.75" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity=".30" />
                <stop offset="22%" stopColor="#fff4de" stopOpacity=".15" />
                <stop offset="52%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="100%" stopColor="#d9a675" stopOpacity=".05" />
              </linearGradient>

              <radialGradient id="mainInnerMilk" cx="48%" cy="16%" r="70%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity=".34" />
                <stop offset="18%" stopColor="#fffdf8" stopOpacity=".22" />
                <stop offset="40%" stopColor="#fff7ef" stopOpacity=".08" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="mainBottomPearl" cx="40%" cy="92%" r="48%">
                <stop offset="0%" stopColor="#ffdff1" stopOpacity=".14" />
                <stop offset="34%" stopColor="#e9dfff" stopOpacity=".08" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>

              <linearGradient
                id="mainIridescentSheen"
                x1="0"
                y1="0"
                x2="1"
                y2="1"
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity=".20" />
                <stop offset="16%" stopColor="#dff6ff" stopOpacity=".16" />
                <stop offset="33%" stopColor="#ffffff" stopOpacity=".08" />
                <stop offset="58%" stopColor="#ffe1f4" stopOpacity=".07" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>

              <radialGradient id="specHot" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity=".95" />
                <stop offset="30%" stopColor="#ffffff" stopOpacity=".52" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="specSoft" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity=".55" />
                <stop offset="42%" stopColor="#ffffff" stopOpacity=".16" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* MAIN PARALLAX BUBBLE */}
            <g id="mainParallax" ref={mainRef}>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  dur="8.5s"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0; .3; .65; 1"
                  keySplines="
                    .42 0 .58 1;
                    .42 0 .58 1;
                    .42 0 .58 1
                  "
                  values="
                    0 0;
                    7 -24;
                    -5 -10;
                    0 0
                  "
                />

                {/* Base Image */}
                <g clipPath="url(#mainBubbleClip)">
                  <image
                    href={HERO_IMG}
                    x="125"
                    y="40"
                    width="930"
                    height="720"
                    preserveAspectRatio="xMidYMid slice"
                  />

                  <rect
                    x="0"
                    y="0"
                    width="1100"
                    height="850"
                    fill="url(#mainInnerMilk)"
                  />
                  <rect
                    x="0"
                    y="0"
                    width="1100"
                    height="850"
                    fill="url(#mainIridescentSheen)"
                  />
                  <rect
                    x="0"
                    y="0"
                    width="1100"
                    height="850"
                    fill="url(#mainBottomPearl)"
                  />

                  <ellipse
                    cx="406"
                    cy="218"
                    rx="48"
                    ry="38"
                    fill="url(#specHot)"
                    transform="rotate(-18 406 218)"
                  />
                  <ellipse
                    cx="438"
                    cy="164"
                    rx="18"
                    ry="14"
                    fill="url(#specSoft)"
                    transform="rotate(-18 438 164)"
                  />
                  <ellipse
                    cx="836"
                    cy="286"
                    rx="16"
                    ry="13"
                    fill="url(#specSoft)"
                  />
                  <ellipse
                    cx="365"
                    cy="678"
                    rx="13"
                    ry="11"
                    fill="url(#specSoft)"
                  />
                </g>

                {/* Distorted Center */}
                <g
                  clipPath="url(#mainBubbleClip)"
                  mask="url(#mainDistortionMask)"
                  filter="url(#mainLiquidFilter)"
                  opacity=".90"
                >
                  <image
                    href={HERO_IMG}
                    x="125"
                    y="40"
                    width="930"
                    height="720"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </g>

                {/* Animated Marquee */}
                <g className="marquee">
                  <text className="marquee__text" dy="-14">
                    <textPath href="#mainBubblePath" startOffset="0%">
                      {MARQUEE_TEXT}
                      <animate
                        attributeName="startOffset"
                        from="0%"
                        to="100%"
                        dur="22s"
                        repeatCount="indefinite"
                      />
                    </textPath>
                  </text>

                  <text className="marquee__text" dy="-14">
                    <textPath href="#mainBubblePath" startOffset="-100%">
                      {MARQUEE_TEXT}
                      <animate
                        attributeName="startOffset"
                        from="-100%"
                        to="0%"
                        dur="22s"
                        repeatCount="indefinite"
                      />
                    </textPath>
                  </text>
                </g>

                <use
                  href="#mainBubblePath"
                  className="bubble-edge bubble-edge--main"
                />
              </g>
            </g>

            {/* SECONDARY PARALLAX BUBBLE */}
            <g id="secondaryParallax" ref={secondaryRef}>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  dur="7s"
                  begin="-2s"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0; .5; 1"
                  keySplines="
                    .42 0 .58 1;
                    .42 0 .58 1
                  "
                  values="
                    0 0;
                    -14 -30;
                    0 0
                  "
                />

                <g
                  filter="url(#secondaryLiquidFilter)"
                  clipPath="url(#secondaryBubbleClip)"
                >
                  <image
                    href={HERO_IMG}
                    x="60"
                    y="230"
                    width="720"
                    height="650"
                    preserveAspectRatio="xMidYMid slice"
                  />

                  <rect
                    x="0"
                    y="0"
                    width="1100"
                    height="850"
                    fill="#efad69"
                    opacity=".06"
                    className="bubble-warm-overlay"
                  />
                  <rect
                    x="0"
                    y="0"
                    width="1100"
                    height="850"
                    fill="url(#glassSheen)"
                    opacity=".72"
                  />
                </g>

                <use href="#secondaryBubblePath" className="bubble-edge" />
              </g>
            </g>

            {/* DROP PARALLAX BUBBLE */}
            <g id="dropParallax" ref={dropRef}>
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  dur="6s"
                  begin="-4s"
                  repeatCount="indefinite"
                  calcMode="spline"
                  keyTimes="0; .5; 1"
                  keySplines="
                    .42 0 .58 1;
                    .42 0 .58 1
                  "
                  values="
                    0 0;
                    15 -34;
                    0 0
                  "
                />

                <g
                  filter="url(#dropLiquidFilter)"
                  clipPath="url(#dropBubbleClip)"
                >
                  <image
                    href={HERO_IMG}
                    x="450"
                    y="470"
                    width="520"
                    height="440"
                    preserveAspectRatio="xMidYMid slice"
                  />

                  <rect
                    x="0"
                    y="0"
                    width="1100"
                    height="850"
                    fill="#ed9e57"
                    opacity=".065"
                    className="bubble-warm-overlay"
                  />
                </g>

                <use href="#dropBubblePath" className="bubble-edge" />
              </g>
            </g>
          </svg>
        </section>
      </main>

      <section className="solutions-section" id="solutions">
        <header className="solutions-header">
          <p className="eyebrow">OVERALL SOLUTION / THE WORK WE ARE BUILDING</p>
          <h2>One evidence layer for better land decisions.</h2>
          <p className="solutions-subtitle">
            A focused platform for the work that is hardest to do today: finding
            the right source, reconciling conflicting policy, and turning a
            district&apos;s evidence into a brief an officer can stand behind.
          </p>
        </header>

        <div className="solutions-grid">
          <article className="solution-card solution-card--featured">
            <span className="card-index">01</span>
            <h3>Centralized Land Governance Repository</h3>
            <p>
              Research papers, policy documents, datasets, legal records, and
              case studies from DILRMP, SVAMITVA, ULPIN, and state sources,
              unified instead of scattered across departments.
            </p>
            <span className="card-status">FUNCTIONAL IN PROTOTYPE</span>
          </article>
          <article className="solution-card solution-card--featured">
            <span className="card-index">02</span>
            <h3>Citation-Grounded AI Search &amp; Synthesis</h3>
            <p>
              Answers cite the exact paragraph and source document, with
              click-to-source highlighting. This is retrieval with evidence, not
              a black-box chatbot guessing from training data.
            </p>
            <span className="card-status">FUNCTIONAL IN PROTOTYPE</span>
          </article>
          <article className="solution-card">
            <span className="card-index">03</span>
            <h3>Cross-Document Contradiction Detection</h3>
            <p>
              Flags where two policy sources disagree, such as a central report
              and a state circular, surfacing conflicts that ordinary search
              leaves buried.
            </p>
            <span className="card-status">FUNCTIONAL IN PROTOTYPE</span>
          </article>
          <article className="solution-card">
            <span className="card-index">04</span>
            <h3>Dispute Intelligence Dashboard</h3>
            <p>
              Trend analysis, cause breakdowns, and resolution-time metrics
              built on real land-dispute data, giving officials an at-a-glance
              view instead of another case-file hunt.
            </p>
            <span className="card-status">FUNCTIONAL IN PROTOTYPE</span>
          </article>
          <article className="solution-card">
            <span className="card-index">05</span>
            <h3>Reform Impact Sandbox</h3>
            <p>
              Test a proposed change against key indicators with a transparent,
              on-screen formula. Outputs are clearly labeled directional
              estimates, not false predictive claims.
            </p>
            <span className="card-status">FUNCTIONAL IN PROTOTYPE</span>
          </article>
          <article className="solution-card solution-card--roadmap">
            <span className="card-index">06</span>
            <h3>GIS &amp; Satellite Integration</h3>
            <p>
              Land use, climate risk, and infrastructure layers over the dispute
              and policy data, built once the core evidence workflow is proven.
            </p>
            <span className="card-status">ROADMAP / SCOPED MOCKUP</span>
          </article>
          <article className="solution-card solution-card--roadmap">
            <span className="card-index">07</span>
            <h3>Federated Architecture</h3>
            <p>
              Connects to DILRMP, SVAMITVA, and ULPIN through APIs instead of
              forcing states to migrate their data. Ownership stays where it
              belongs.
            </p>
            <span className="card-status">ROADMAP / INTEGRATION PATH</span>
          </article>
          <article className="solution-card solution-card--roadmap">
            <span className="card-index">08</span>
            <h3>Innovation Portal</h3>
            <p>
              Hackathons, research grants, and pilot tracking to keep the
              platform growing after launch.
            </p>
            <span className="card-status">ROADMAP / SCOPED MOCKUP</span>
          </article>
        </div>
      </section>

      <section className="workflow-section" id="workflow">
        <div className="workflow-image">
          <img src="/modiji2.png" alt="Prime Minister Narendra Modi" />
          <span className="image-caption">
            Technology that serves accountable public decisions
          </span>
        </div>
        <div className="workflow-copy">
          <p className="eyebrow">BUILT AROUND ONE REAL WORKFLOW</p>
          <h2>
            A district land officer prepares a dispute brief in under 40
            minutes.
          </h2>
          <p className="workflow-lead">
            The platform is designed around a person and a decision, not a
            feature list.
          </p>
          <ol className="workflow-steps">
            <li>
              <strong>01 / Find</strong>
              <span>
                Search the repository across central and state sources.
              </span>
            </li>
            <li>
              <strong>02 / Verify</strong>
              <span>
                Read cited passages, inspect conflicts, and click to the source.
              </span>
            </li>
            <li>
              <strong>03 / Understand</strong>
              <span>
                Use the dispute dashboard to see causes, trends, and resolution
                time.
              </span>
            </li>
            <li>
              <strong>04 / Brief</strong>
              <span>
                Test a reform in the sandbox and take a transparent estimate to
                the Collector.
              </span>
            </li>
          </ol>
        </div>
      </section>

      <section className="trust-section" id="trust">
        <div className="trust-copy">
          <p className="eyebrow">REAL VS. ROADMAP</p>
          <h2>We show the boundary clearly.</h2>
          <p>
            Repository, search, synthesis, contradiction detection, dashboard,
            and sandbox are functional in the prototype. GIS, grants, and full
            collaboration workspaces are shown as scoped mockups deliberately,
            not hidden behind a demo narrative.
          </p>
          <div className="trust-legend">
            <span>
              <i className="legend-dot legend-dot--live" />
              Functional prototype
            </span>
            <span>
              <i className="legend-dot legend-dot--roadmap" />
              Roadmap / mockup
            </span>
          </div>
        </div>
        <div className="trust-image">
          <img
            src="/modiji3.png"
            alt="Prime Minister Narendra Modi addressing the nation"
          />
        </div>
      </section>
    </div>
  );
}
