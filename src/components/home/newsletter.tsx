"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Mail, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { subscribeNewsletterAction } from "./newsletter-actions";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [pending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const formData = new FormData();
    formData.set("email", email);

    startTransition(async () => {
      const result = await subscribeNewsletterAction(formData);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Bültene kaydınız alındı", {
          description: "Yeni ürün ve kampanyalardan haberdar olacaksınız.",
        });
        setEmail("");
      }
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-primary px-8 py-12 text-center text-cream sm:px-16"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-light/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

        <div className="relative">
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl text-balance">
            Bültenimize Katılın
          </h2>
          <p className="mx-auto mt-2 max-w-md text-cream/70 text-sm">
            Yeni ürün ve kampanyalardan ilk siz haberdar olun.
          </p>
          <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
              <Input
                type="email"
                placeholder="E-posta"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-12 bg-cream"
              />
            </div>
            <Button type="submit" variant="accent" size="lg" disabled={pending}>
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Abone Ol"}
            </Button>
          </form>
        </div>
      </motion.div>
    </section>
  );
}
