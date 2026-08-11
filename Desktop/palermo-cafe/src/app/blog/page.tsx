"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, ArrowRight, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { Card, CardContent } from "@/components/ui/card";
import { GradientDivider } from "@/components/shared/SectionDivider";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  image: string | null;
  author: string;
  tags: string | null;
  createdAt: string;
}

const fallbackImages = [
  "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const postsSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: postsScrollYProgress } = useScroll({
    target: postsSectionRef,
    offset: ["start end", "end start"],
  });
  const postsBgY = useTransform(postsScrollYProgress, [0, 1], ["0%", "5%"]);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {/* Hero with parallax food image */}
        <section ref={heroRef} className="relative py-24 sm:py-32 overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: heroY }}>
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop"
              alt=""
              className="absolute inset-0 w-full h-[130%] object-cover"
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/85 via-brand-dark/70 to-brand-dark/90" />
            <div className="absolute inset-0 bg-gradient-to-br from-brand-espresso/30 via-transparent to-brand-primary/20" />
          </motion.div>

          {/* Floating food elements */}
          <motion.div
            className="absolute top-24 right-16 w-36 h-36 rounded-full overflow-hidden opacity-15 hidden lg:block"
            animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=300&fit=crop"
              alt=""
              className="w-full h-full object-cover rounded-full"
              aria-hidden="true"
            />
          </motion.div>

          <motion.div
            className="absolute bottom-12 left-12 w-28 h-28 rounded-full overflow-hidden opacity-10 hidden lg:block"
            animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <img
              src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=250&h=250&fit=crop"
              alt=""
              className="w-full h-full object-cover rounded-full"
              aria-hidden="true"
            />
          </motion.div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-brand-accent font-medium tracking-wider uppercase text-xs sm:text-sm">
                Blog
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-bold text-white mt-4 mb-4 sm:mb-6 px-2">
                Historias de{" "}
                <span className="text-brand-accent italic">nuestra cocina</span>
              </h1>
              <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent mx-auto mb-4 sm:mb-6" />
              <p className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto px-4">
                Noticias, recetas y la historia detrás de cada plato.
              </p>
            </motion.div>
          </div>
        </section>

        <GradientDivider />

        {/* Blog posts with parallax background */}
        <section ref={postsSectionRef} className="relative py-12 sm:py-16 overflow-hidden">
          <motion.div className="absolute inset-0" style={{ y: postsBgY }}>
            <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
          </motion.div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full mx-auto" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <span className="text-2xl sm:text-3xl">📝</span>
                </div>
                <p className="text-muted-foreground text-base sm:text-lg">
                  Próximamente publicaremos artículos interesantes.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <a
                      href={`/blog/${post.slug}`}
                      className="block group"
                    >
                      <Card className="overflow-hidden card-premium bg-card border-border/50 shadow-lg h-full">
                        <div className="relative h-44 sm:h-56 overflow-hidden">
                          <img
                            src={
                              post.image ||
                              fallbackImages[index % fallbackImages.length]
                            }
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-sm px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold text-brand-primary shadow-lg">
                            {post.author}
                          </div>
                        </div>
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <time>
                              {new Date(post.createdAt).toLocaleDateString(
                                "es-PE",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </time>
                          </div>
                          <h2 className="text-base sm:text-xl font-display font-bold text-foreground mb-2 sm:mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
                            {post.title}
                          </h2>
                          <p className="text-muted-foreground text-sm line-clamp-3 mb-3 sm:mb-4 leading-relaxed">
                            {post.excerpt}
                          </p>
                          <span className="inline-flex items-center gap-2 text-brand-primary text-sm font-semibold group-hover:gap-3 transition-all">
                            Leer artículo
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </CardContent>
                      </Card>
                    </a>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
