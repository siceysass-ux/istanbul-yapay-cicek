"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Hand, Droplet, Sun, Leaf, Award, Truck } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";

const features = [
  { icon: Hand, title: "Gerçek Doku", desc: "Islak dokulu yapraklar, gerçek çiçekten ayırt edilemez." },
  { icon: Droplet, title: "Bakım Yok", desc: "Sulama, güneş, budama gerekmez. Yıllar boyu ilk günkü gibi." },
  { icon: Sun, title: "UV Korumalı", desc: "İç ve dış mekan uyumlu, solmaz. Güneş ışığına dayanıklı." },
  { icon: Leaf, title: "Doğal Görünüm", desc: "Profesyonel tasarım, doğanın estetiğini yansıtır." },
  { icon: Award, title: "Premium Kalite", desc: "1. sınıf malzeme, 2 yıl garanti. Uzun ömürlü." },
  { icon: Truck, title: "Hızlı Teslimat", desc: "İstanbul içi 1-3 iş günü, tüm Türkiye 2-5 iş günü." },
];

export function Storytelling() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="relative overflow-hidden bg-ink py-20 text-cream">
      {/* Arka plan görsel — parallax */}
      <motion.div style={{ y }} className="absolute inset-0 opacity-15">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/storytelling.webp"
          alt=""
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Dekoratif blur katmanları */}
      <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-primary-light/20 blur-[120px]" />
      <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-accent/15 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-3"
          >
            <span className="font-serif text-sm font-bold text-accent/60">05</span>
            <span className="font-script text-xl text-accent">Neden Biz?</span>
            <span className="h-px w-8 bg-accent/40" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-2xl font-semibold sm:text-3xl mt-2 text-cream"
          >
            Premium Yapay Bitki Deneyimi
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-2 text-sm text-cream/60"
          >
            Gerçekçilik, dayanıklılık ve estetik bir arada
          </motion.p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative rounded-3xl border border-cream/10 bg-cream/5 p-8 backdrop-blur-sm transition-all duration-500 hover:border-accent/30 hover:bg-cream/10"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-light/30 to-accent/20 text-accent transition-transform duration-500 group-hover:scale-110">
                <feature.icon className="h-7 w-7" />
              </div>
              <h3 className="font-serif text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-cream/60">{feature.desc}</p>

              {/* Hover çizgi */}
              <div className="mt-4 h-px w-0 bg-accent/40 transition-all duration-500 group-hover:w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
