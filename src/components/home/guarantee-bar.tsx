"use client";

import { motion } from "framer-motion";
import { Truck, RotateCcw, CreditCard, MapPin } from "lucide-react";

const guarantees = [
  { icon: Truck, title: "Ücretsiz Kargo", desc: "2000₺ üzeri" },
  { icon: RotateCcw, title: "14 Gün İade", desc: "Koşulsuz" },
  { icon: CreditCard, title: "3 Taksit", desc: "Kredi kartına" },
  { icon: MapPin, title: "Kapıda Ödeme", desc: "İstanbul içi" },
];

export function GuaranteeBar() {
  return (
    <section className="border-y border-primary/10 bg-cream-dark/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 md:grid-cols-4 lg:px-8">
        {guarantees.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <item.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-serif text-sm font-semibold">{item.title}</h3>
              <p className="text-xs text-muted">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
