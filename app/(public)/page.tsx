"use client";

import Image from "next/image";
import { Button } from "@/app/components/common/button";
import { CreateAccountLink } from "@/app/components/auth/create-account-link";
import { EarlyAccessBanner } from "@/app/components/common/early-access-banner";
import { useModal } from "@/app/store/modalContext";
import Link from "next/link";
import { useState } from "react";
import "@/app/styles/landingPage.css";

const features = [
  {
    number: "01",
    title: "Appointments in one timeline",
    description:
      "Keep upcoming visits, dates, times, and provider details together instead of checking multiple portals.",
  },
  {
    number: "02",
    title: "Every provider in one directory",
    description:
      "Save doctors, specialists, clinics, phone numbers, locations, and specialties without digging through portals, texts, and paperwork.",
  },
  {
    number: "03",
    title: "Reminders that reduce the mental load",
    description:
      "Track follow-ups, annual visits, dental cleanings, prescription questions, and care tasks you do not want to forget.",
  },
  {
    number: "04",
    title: "Care rhythms based on your input",
    description:
      "Use the timing you enter to organize repeat care rhythms, while keeping medical decisions between you and your providers.",
  },
  {
    number: "05",
    title: "Notes before and after visits",
    description:
      "Capture questions before a visit and notes afterward, so the important details do not disappear between appointments.",
  },
  {
    number: "06",
    title: "Family care support",
    description:
      "Organize care details for yourself and the family members you help support, without mixing everything across portals.",
  },
];

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Get Started", href: "#get-started" },
];

export default function Home() {
  const { openSignInModal } = useModal();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <main className="overflow-hidden bg-[#f4f7fa] text-slate-950">
      <nav className="absolute inset-x-0 top-0 z-20 border-b border-white/10 bg-primary/95 backdrop-blur-xl">
        <div className="container flex min-h-20 items-center justify-between gap-6 lg:grid lg:grid-cols-[1fr_auto_1fr]">
          <a
            className="flex items-center gap-3"
            href="#top"
            aria-label="MyDocDay home"
            onClick={closeMobileMenu}
          >
            <span className="text-lg font-bold tracking-tight text-white">
              MyDocDay
            </span>
          </a>

          <div className="hidden items-center justify-center gap-8 lg:flex">
            {navItems.map((item) => (
              <a
                className="text-sm font-semibold text-white/80 hover:text-white"
                href={item.href}
                key={item.href}
              >
                {item.label}
              </a>
            ))}
            <Link
              className="text-sm font-semibold text-white/80 hover:text-white"
              href="/privacy"
            >
              Privacy Statement
            </Link>
          </div>

          <div className="hidden items-center justify-end gap-4 lg:flex">
            <Button buttonText="Sign in" onClick={openSignInModal} />
            <CreateAccountLink>
              <Button buttonText="Create Account" varient="primary" />
            </CreateAccountLink>
          </div>

          <button
            aria-controls="mobile-landing-menu"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="hamburger-button lg:hidden"
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        <div
          className={`mobile-landing-menu lg:hidden ${
            isMobileMenuOpen ? "is-open" : ""
          }`}
          id="mobile-landing-menu"
        >
          <div className="container flex min-h-[calc(100dvh-5rem)] flex-col py-6">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  className="mobile-landing-link"
                  href={item.href}
                  key={item.href}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </a>
              ))}
              <Link
                className="mobile-landing-link"
                href="/privacy"
                onClick={closeMobileMenu}
              >
                Privacy Statement
              </Link>
            </div>

            <div className="mobile-menu-actions mt-auto border-t border-white/10 pt-6">
              <CreateAccountLink onNavigate={closeMobileMenu}>
                <Button buttonText="Create Account" varient="primary" />
              </CreateAccountLink>
              <Button
                buttonText="Sign in"
                className="mt-4"
                onClick={() => {
                  openSignInModal();
                  closeMobileMenu();
                }}
                varient="secondary"
              />
            </div>
          </div>
        </div>
      </nav>

      <section
        className="hero-surface relative overflow-hidden pb-[22rem] pt-36 text-white sm:pb-[25rem] lg:overflow-visible lg:pb-28 lg:pt-44"
        id="top"
      >
        <EarlyAccessBanner />
        <div className="container hero-content-shell relative z-10">
          <div className="row items-center [--gutter-y:3.5rem] lg:[--gutter-x:4rem]">
            <div className="col-12 lg:col-6">
              <div className="max-w-2xl">
                <span className="inline-flex items-center border-l-[3px] border-secondary py-[0.15rem] pl-[0.7rem] text-[0.72rem] font-extrabold uppercase leading-none tracking-[0.16em] text-[#b9efed]">
                  Your healthcare in one place
                </span>
                <h1 className="mt-7 text-5xl font-bold leading-[1.04] tracking-[-0.035em] sm:text-6xl lg:text-6xl">
                  Stop bouncing between portals to manage your care.
                </h1>
                <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
                  MyDocDay brings appointments, providers, reminders, and visit
                  notes into one simple place, so your healthcare details are
                  easier to find, track, and act on for yourself and the family
                  members you support.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <CreateAccountLink>
                    <Button varient="primary" buttonText="Create Account" />
                  </CreateAccountLink>
                  <a href="#features" className="button-secondary">
                    See Launch Features
                  </a>
                </div>
              </div>
            </div>

            <div className="hero-phone-stage col-12 lg:col-6">
              <Image
                priority
                className="hero-phone-image h-auto w-full drop-shadow-[0_34px_70px_rgb(0_0_0/34%)]"
                src="/images/mydocday-phone-dashboard-cropped.png"
                alt="Preview concept of the future MyDocDay mobile dashboard"
                width={536}
                height={1024}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 lg:pt-32" id="features">
        <div className="container">
          <div className="row [--gutter-y:2rem] lg:[--gutter-x:3rem]">
            <div className="col-12 lg:col-5">
              <span className="inline-flex items-center border-l-[3px] border-secondary py-[0.15rem] pl-[0.7rem] text-[0.72rem] font-extrabold uppercase leading-none tracking-[0.16em] text-primary">
                Launch features
              </span>
              <h2 className="mt-6 max-w-2xl text-[clamp(2.5rem,5vw,4.25rem)] font-bold leading-[1.08] tracking-[-0.035em] text-slate-950">
                Less portal hopping. More clarity around what comes next.
              </h2>
            </div>
            <div className="col-12 lg:col-7">
              <div className="row [--gutter-y:1rem]">
                {features.map((feature) => (
                  <div className="col-12" key={feature.number}>
                    <article className="flex gap-5 rounded-xl border border-slate-200 bg-white/[0.86] p-6 shadow-[0_10px_28px_rgb(31_53_87/6%)] transition-[border-color,transform,box-shadow] duration-[180ms] hover:-translate-y-0.5 hover:border-[#8bb4b2] hover:shadow-[0_14px_34px_rgb(31_53_87/9%)]">
                      <span className="grid size-11 shrink-0 place-items-center rounded-[0.4rem] bg-[#dff4f3] text-xs font-black text-primary">
                        {feature.number}
                      </span>
                      <div>
                        <h3 className="text-xl font-bold tracking-tight">
                          {feature.title}
                        </h3>
                        <p className="mt-2 leading-7 text-slate-600">
                          {feature.description}
                        </p>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:pb-20 lg:pt-0" id="get-started">
        <div className="container">
          <div className="cta-panel relative overflow-hidden rounded-2xl p-[clamp(2rem,6vw,5rem)] shadow-[0_24px_60px_rgb(31_53_87/18%)]">
            <div className="row items-center [--gutter-y:2rem]">
              <div className="col-12 lg:col-8">
                <span className="inline-flex items-center border-l-[3px] border-secondary py-[0.15rem] pl-[0.7rem] text-[0.72rem] font-extrabold uppercase leading-none tracking-[0.16em] text-[#b9efed]">
                  Early access is open
                </span>
                <h2 className="mt-6 max-w-3xl text-4xl font-bold tracking-[-0.025em] text-white sm:text-5xl">
                  Create your MyDocDay account now!
                </h2>
              </div>
              <div className="col-12 lg:col-4">
                <div className="flex lg:justify-end">
                  <CreateAccountLink>
                    <Button varient="primary" buttonText="Create Account" />
                  </CreateAccountLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-8">
        <div className="container flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
          <p>&copy; 2026 MyDocDay. Your healthcare, organized.</p>
          <div className="flex gap-6">
            <Link className="hover:text-slate-950" href="/privacy">
              Privacy Statement
            </Link>
            <a
              className="hover:text-slate-950"
              href="mailto:dillonarnold02@outlook.com"
            >
              Contact
            </a>
            <a
              className="hover:text-slate-950"
              href="https://www.linkedin.com/in/dillonarnold/"
              rel="noreferrer"
              target="_blank"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
