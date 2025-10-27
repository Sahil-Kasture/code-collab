import React from "react";

import { Link ,useNavigate } from "react-router-dom";

const CodeCollab = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const navigate=useNavigate()

  React.useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev;
    };
  }, []);

  return (
    <div className="bg-[#f6f7f8] dark:bg-[#101922] font-['Space_Grotesk'] text-gray-900 dark:text-white min-h-screen w-full overflow-x-hidden">
      <div className="flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-gray-200 dark:border-[#233648] px-4 sm:px-10 py-3 relative">
          <div className="flex items-center gap-4 text-gray-900 dark:text-white">
            <div className="text-[#1173d4]">
              <span className="material-symbols-outlined text-3xl">
                code_blocks
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">Code Collab</h2>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 justify-end gap-8">
            <div className="flex items-center gap-9">
              <a
                href="#Features"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#1173d4]"
              >
                Features
              </a>
              <a
                href="#Testimonials"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#1173d4]"
              >
                Testimonials
              </a>
              <a
                href="#CTA"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-[#1173d4]"
              >
                Pricing
              </a>
            </div>

            <div className="flex gap-2">
              <button className="rounded-lg h-10 px-4 bg-[#1173d4] text-white text-sm font-bold hover:bg-[#1173d4]/90 transition-colors">
                <Link to="/signUp">Sign Up</Link>
              </button>
              <button className="rounded-lg h-10 px-4 bg-gray-200 dark:bg-[#233648] text-gray-900 dark:text-white text-sm font-bold hover:bg-gray-300 dark:hover:bg-[#324d67] transition-colors">
                <Link to="/login">Log In</Link>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 dark:text-gray-300 focus:outline-none"
            >
              <span className="material-symbols-outlined text-3xl">
                {menuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>

          {/* Mobile Dropdown */}
          <div
            className={`absolute top-full left-0 w-full bg-white dark:bg-[#192633] border-t border-gray-200 dark:border-[#233648] flex flex-col items-center gap-4 py-4 md:hidden z-50 transition-all duration-300 ${
              menuOpen
                ? "opacity-100 visible translate-y-0"
                : "opacity-0 invisible -translate-y-2"
            }`}
          >
            <a
              href="#Features"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#1173d4]"
            >
              Features
            </a>
            <a
              href="#Testimonials"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#1173d4]"
            >
              Testimonials
            </a>
            <a
              href="#CTA"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#1173d4]"
            >
              Pricing
            </a>
            <div className="flex gap-2">
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-lg h-10 px-4 bg-[#1173d4] text-white text-sm font-bold hover:bg-[#1173d4]/90 transition-colors"
              >
                <Link to="/signUp">Sign Up</Link>
              </button>
              <button
                onClick={() => setMenuOpen(false)}
                className="rounded-lg h-10 px-4 bg-gray-200 dark:bg-[#233648] text-gray-900 dark:text-white text-sm font-bold hover:bg-gray-300 dark:hover:bg-[#324d67] transition-colors"
              >
                <Link to="/login">Log In</Link>
              </button>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex flex-col flex-1 px-4 md:px-10 lg:px-40 py-10">
          {/* Hero */}
          <section className="flex flex-col gap-10 py-16 text-center items-center">
            <h1 className="text-4xl font-black @[480px]:text-5xl @[864px]:text-6xl max-w-3xl leading-tight">
              Collaborative Coding, Simplified.
            </h1>
            <h2 className="text-base text-gray-600 dark:text-gray-300 max-w-2xl @[480px]:text-lg">
              Code Collab is a real-time collaborative code editor that makes it
              easy to code with others, no matter where they are. Create or join
              a room and start coding together instantly.
            </h2>
            <button onClick={()=>{navigate('/signUp')}} className="h-12 px-5 bg-[#1173d4] text-white text-base font-bold rounded-lg hover:bg-[#1173d4]/90 transition-colors">
              Get Started for Free
            </button>
            <div
              className="w-full aspect-video bg-cover bg-center rounded-xl border border-gray-200 dark:border-[#233648]"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBSY0NLurgDV5rZpO0p9fCFHuw8_crq3xkcY4-5WpyVkdUTWiOrjL0bqmf-ddBuXOY1VQfbusXAPPphDIRVCh_gTaBSdcl6D_NNLhxDSlBbiPxcH9rrk_ZfHkURjOIgajftfRDf14Yzbx_MACHM2Ws09TPqOOWzf-bOECaChOYEPZcwXAAe6gr8TnMAFFLppeOQe4nsm20rStIzcx_DVsNt-qzFv0GzvRgi6UlO8GNo2GExK6Fk3qoR7qTz1JYsn27B7OINzbbuPQ')",
              }}
            ></div>
          </section>

          {/* Features */}
          <section
            id="Features"
            className="flex flex-col gap-10 py-16 text-center items-center"
          >
            <h1 className="text-3xl font-black @[480px]:text-4xl max-w-2xl leading-tight">
              Everything you need to collaborate effectively
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl">
              Code Collab is packed with features to help you and your team work
              together seamlessly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: "group",
                  title: "Real-time Collaboration",
                  desc: "Work together on the same code at the same time, with changes reflected instantly.",
                },
                {
                  icon: "terminal",
                  title: "Multi-language Support",
                  desc: "Code in your favorite language, with support for JavaScript, Python, Java, C++, and more.",
                },
                {
                  icon: "share",
                  title: "Easy Sharing",
                  desc: "Share your code with a single click, and invite others to collaborate with you.",
                },
                {
                  icon: "psychology",
                  title: "AI Assistant",
                  desc: "Get instant help with your code using our intelligent AI assistant that understands context and provides smart suggestions.",
                },
                {
                  icon: "bug_report",
                  title: "Automated Debugging",
                  desc: "Let our AI assistant identify and help fix bugs in real-time, making your development process smoother.",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="group flex flex-col gap-4 rounded-xl hover:cursor-pointer border border-gray-200 dark:border-[#233648] bg-white dark:bg-[#192633] p-6 transform transition duration-300 ease-out hover:scale-105 hover:shadow-lg hover:border-blue-300 dark:hover:border-[#1173d4]"
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#eaf3ff] dark:bg-[#0f2a3a] transition-colors duration-300 group-hover:bg-[#1173d4]">
                    <span className="material-symbols-outlined text-3xl text-[#1173d4] dark:text-[#8fc6ff] transition-colors duration-300 group-hover:text-white">
                      {f.icon}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold">{f.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-[#92adc9]">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Testimonials */}
          <section id="Testimonials" className="py-16">
            <h1 className="text-3xl font-black text-center mb-12">
              Loved by developers worldwide
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  name: "Sarah Lee",
                  role: "Software Engineer at Google",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzvzXqy0EZ1bpzsRX6-YGO_A525PbKrzstbIKQxYpwLlqILFNV4bDLy51qRIjlcfitDTcRt9J11ooMg0Nt45GHpLMScXBxO_hFGwlctapkJ1sUk0qGMeGPdcN2XgGgtktrDF6BAs1grN3zApw0ZPZ5fPEkqImPJKIjD8hxQRoeShd7S4WQ8MsYSKw6o-_C2VxGiM9N_ZikmuzKiBhKuzas0iIPxN4eN9NCDAtE_I0zZtYGjLO6GOMZ6TAv2IbGVgJG-zdX37ULxg",
                  text: `"Code Collab has been a game-changer for my team. We can now work on the same codebase from anywhere in the world, and it's made our development process so much more efficient."`,
                },
                {
                  name: "Michael Chen",
                  role: "Student at MIT",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPE949d3yU0L6I1VH0mIvaE0uDNHdLNmfW0JzuZjFlSLXn9EUHEC7PXIRBxD7Nxhg6MduIaq3w7_FNCS8Thx-mqodHbb0z1oCnPlJ-UqqaiSLDvV7jOCWAqiGo-EF-lRWfLLuRN26siR9Fa4FrSipVJDGXJQjW-Q8yYicm1RMMFafjnlx2Qlwc7bvP6w9NMDdX2VOu47jNHaLThHyZ9pgWKR6MoszVGaZr5-sy4QjrfNuY7VKSWqWDprWDCdWD8R7-r0SQgWyHSA",
                  text: `"I love using Code Collab for my school projects. It's so easy to use, and it makes collaborating with my classmates a breeze."`,
                },
              ].map((t, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-4 rounded-xl border border-gray-200 dark:border-[#233648] p-6 bg-white dark:bg-[#192633]"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="bg-cover bg-center rounded-full size-12"
                      style={{ backgroundImage: `url(${t.img})` }}
                    ></div>
                    <div>
                      <p className="font-medium">{t.name}</p>
                      <p className="text-sm text-gray-600 dark:text-[#92adc9]">
                        {t.role}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-yellow-500">
                    {[...Array(5)].map((_, j) => (
                      <span
                        key={j}
                        className="material-symbols-outlined !text-xl"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-base text-gray-600 dark:text-gray-300">
                    {t.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section
            id="CTA"
            className="flex flex-col justify-center items-center gap-6 px-4 py-16 text-center"
          >
            <h1 className="text-3xl font-black @[480px]:text-4xl max-w-2xl leading-tight">
              Ready to start collaborating?
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300 max-w-2xl">
              Sign up for Code Collab today and experience the future of
              software development.
            </p>
            <button onClick={()=>{navigate('/signUp')}} className="h-12 px-5 bg-[#1173d4] text-white text-base font-bold rounded-lg hover:bg-[#1173d4]/90 transition-colors">
              Get Started for Free
            </button>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-[#233648] px-4 sm:px-10 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="text-[#1173d4]">
                <span className="material-symbols-outlined text-3xl">
                  code_blocks
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © 2025 Sahil Kasture . All rights reserved. 
              </p>
            </div>
            <div className="flex gap-6">
              <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#1173d4]"
              >
                About Us
              </a>
              <a
                href="#"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-[#1173d4]"
              >
                Contact
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default CodeCollab;
