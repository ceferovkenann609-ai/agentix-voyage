import { Link, useParams } from "@tanstack/react-router";

const industries = {
  restaurants: {
    title: "Restaurant AI Solutions",
    subtitle:
      "Automate reservations, WhatsApp orders and customer support with intelligent AI assistants.",
    stats: [
      { label: "More Reservations", value: "+38%" },
      { label: "Available", value: "24/7" },
      { label: "Manual Work", value: "-60%" },
    ],
    problems: [
      "Missed customer calls",
      "Slow reservation process",
      "High staff workload",
      "Lost repeat customers",
    ],
    features: [
      "AI Waiter",
      "Reservation Automation",
      "WhatsApp Ordering",
      "Voice Receptionist",
      "Google Reviews Assistant",
      "CRM Integration",
    ],
    benefits: [
      "24/7 Customer Support",
      "Increase Reservations",
      "Reduce Staff Costs",
      "Improve Customer Experience",
      "Automate Daily Tasks",
      "Generate More Revenue",
    ],
  },

  ecommerce: {
    title: "E-commerce AI Solutions",
    subtitle:
      "Increase online sales with AI shopping assistants and automated support.",
    stats: [
      { label: "Sales Growth", value: "+27%" },
      { label: "Support", value: "24/7" },
      { label: "Response Time", value: "<5 sec" },
    ],
    problems: [
      "Too many support requests",
      "Abandoned carts",
      "Slow responses",
      "Manual order tracking",
    ],
    features: [
      "AI Sales Assistant",
      "Product Recommendation",
      "Order Tracking",
      "Customer Support",
      "Lead Collection",
      "CRM Integration",
    ],
    benefits: [
      "Higher Conversion Rate",
      "Faster Responses",
      "Lower Support Costs",
      "More Sales",
      "Better Customer Experience",
      "Automated Workflow",
    ],
  },

  healthcare: {
    title: "Healthcare AI Solutions",
    subtitle:
      "Automate appointments and improve patient communication using AI.",
    stats: [
      { label: "Reception Work", value: "-60%" },
      { label: "Availability", value: "24/7" },
      { label: "Appointments", value: "+40%" },
    ],
    problems: [
      "Busy phone lines",
      "Missed appointments",
      "Too many repetitive questions",
      "Reception overload",
    ],
    features: [
      "Appointment Booking",
      "Voice Receptionist",
      "Patient FAQ",
      "Reminder Automation",
      "AI Chatbot",
      "CRM Integration",
    ],
    benefits: [
      "Better Patient Experience",
      "Fewer Missed Appointments",
      "Lower Reception Costs",
      "Faster Communication",
      "24/7 Availability",
      "Automated Scheduling",
    ],
  },
  "real-estate": {
    title: "Real Estate AI Solutions",
    subtitle:
      "Qualify property inquiries, book viewings and follow up with buyers automatically.",
    stats: [
      { label: "Lead Response", value: "<10 sec" },
      { label: "Viewings", value: "+31%" },
      { label: "Follow-ups", value: "24/7" },
    ],
    problems: [
      "Slow lead response",
      "Manual viewing scheduling",
      "Missed property inquiries",
      "Inconsistent follow-up",
    ],
    features: [
      "Lead Qualification",
      "Viewing Scheduler",
      "Property FAQ",
      "WhatsApp Follow-up",
      "CRM Updates",
      "Buyer Segmentation",
    ],
    benefits: [
      "More Qualified Buyers",
      "Faster Response Times",
      "Higher Viewing Rate",
      "Automated Follow-ups",
      "Cleaner CRM Data",
      "Better Client Experience",
    ],
  },
  "law-firms": {
    title: "Law Firm AI Solutions",
    subtitle:
      "Automate client intake, document requests and consultation scheduling with secure AI assistants.",
    stats: [
      { label: "Intake Time", value: "-45%" },
      { label: "Availability", value: "24/7" },
      { label: "Consults", value: "+22%" },
    ],
    problems: [
      "Manual client intake",
      "Repeated document requests",
      "Missed consultation leads",
      "Slow first response",
    ],
    features: [
      "Client Intake Bot",
      "Document Checklist",
      "Consultation Booking",
      "Case Routing",
      "Secure FAQ",
      "CRM Integration",
    ],
    benefits: [
      "Faster Intake",
      "Higher Consult Conversion",
      "Reduced Admin Work",
      "Better Lead Qualification",
      "Consistent Communication",
      "Secure Operations",
    ],
  },
  hotels: {
    title: "Hotel AI Solutions",
    subtitle:
      "Deliver instant guest support, reservation automation and AI concierge service around the clock.",
    stats: [
      { label: "Guest Replies", value: "24/7" },
      { label: "Reception Load", value: "-52%" },
      { label: "Upsells", value: "+18%" },
    ],
    problems: [
      "Reception overload",
      "Repeated guest questions",
      "Manual reservation changes",
      "Missed upsell opportunities",
    ],
    features: [
      "AI Concierge",
      "Reservation Support",
      "Guest FAQ",
      "Room Service Requests",
      "Review Assistant",
      "CRM Integration",
    ],
    benefits: [
      "Better Guest Experience",
      "Lower Reception Workload",
      "Faster Service",
      "More Upsell Revenue",
      "Consistent Communication",
      "24/7 Availability",
    ],
  },
  "beauty-salons": {
    title: "Beauty Salon AI Solutions",
    subtitle:
      "Automate appointment booking, reminders and customer engagement for salons and clinics.",
    stats: [
      { label: "No-shows", value: "-34%" },
      { label: "Bookings", value: "+29%" },
      { label: "Replies", value: "24/7" },
    ],
    problems: [
      "Manual appointment booking",
      "No-show customers",
      "Slow social media replies",
      "Limited receptionist hours",
    ],
    features: [
      "Appointment Booking",
      "Reminder Automation",
      "Instagram DM Assistant",
      "Service Recommendations",
      "Customer Rebooking",
      "CRM Integration",
    ],
    benefits: [
      "More Bookings",
      "Fewer No-shows",
      "Higher Rebooking Rate",
      "Faster Replies",
      "Reduced Admin Work",
      "Better Client Experience",
    ],
  },
  education: {
    title: "Education AI Solutions",
    subtitle:
      "Support students, automate admissions and answer parent or applicant questions instantly.",
    stats: [
      { label: "Student Support", value: "24/7" },
      { label: "Admin Work", value: "-48%" },
      { label: "Enrollment", value: "+21%" },
    ],
    problems: [
      "High volume of repeated questions",
      "Manual enrollment follow-up",
      "Slow student support",
      "Fragmented communications",
    ],
    features: [
      "Student Support Bot",
      "Admissions Assistant",
      "Course FAQ",
      "Enrollment Follow-up",
      "WhatsApp Support",
      "CRM Integration",
    ],
    benefits: [
      "Faster Student Support",
      "Higher Enrollment Conversion",
      "Reduced Admin Load",
      "Better Applicant Experience",
      "Automated Follow-up",
      "Consistent Answers",
    ],
  },
} as const;

export default function IndustrySolution() {
  const { industry } = useParams({
    from: "/solutions/$industry",
  });

  const data =
    industries[industry as keyof typeof industries] ??
    industries.restaurants;
      return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <div>

            <p className="uppercase tracking-[6px] text-cyan-400 font-semibold">
              INDUSTRY SOLUTION
            </p>

            <h1 className="mt-6 text-6xl font-bold">
              {data.title}
            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-relaxed">
              {data.subtitle}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                to="/book-demo"
                className="rounded-xl bg-cyan-500 hover:bg-cyan-400 transition px-8 py-4 font-semibold text-black"
              >
                Book Free Demo
              </Link>

              <Link
                to="/contact"
                className="rounded-xl border border-zinc-700 px-8 py-4 hover:border-cyan-400 transition"
              >
                Contact Us
              </Link>

            </div>

          </div>

          <div className="grid grid-cols-3 gap-5">

            {data.stats.map((item) => (

              <div
                key={item.label}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-8 text-center"
              >

                <div className="text-4xl font-bold text-cyan-400">
                  {item.value}
                </div>

                <div className="mt-3 text-zinc-400">
                  {item.label}
                </div>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* Problems */}

      <section className="max-w-7xl mx-auto px-6 py-10">

        <h2 className="text-4xl font-bold text-center">
          Common Business Challenges
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">

          {data.problems.map((problem) => (

            <div
              key={problem}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6"
            >
              <div className="text-3xl">⚠️</div>

              <p className="mt-5 text-zinc-300">
                {problem}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* Features */}

      <section className="max-w-7xl mx-auto px-6 py-10">

        <h2 className="text-4xl font-bold text-center">
          Agentix AI Features
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">

          {data.features.map((feature) => (

            <div
              key={feature}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 hover:border-cyan-400 transition"
            >
              <div className="text-2xl">✅</div>

              <h3 className="mt-4 text-xl font-semibold">
                {feature}
              </h3>

            </div>

          ))}

        </div>

      </section>

      {/* Benefits */}

      <section className="max-w-7xl mx-auto px-6 py-10 pb-24">

        <h2 className="text-4xl font-bold text-center">
          Benefits
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">

          {data.benefits.map((benefit) => (

            <div
              key={benefit}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6"
            >
              ✔ {benefit}
            </div>

          ))}

        </div>

        <div className="mt-20 text-center">

          <h2 className="text-5xl font-bold">
            Ready to Transform Your Business?
          </h2>

          <p className="mt-6 text-zinc-400 max-w-2xl mx-auto">
            Let's build an AI solution tailored specifically for your business.
          </p>

          <Link
            to="/book-demo"
            className="inline-block mt-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition px-10 py-5 text-black font-bold"
          >
            Book Your Free Demo
          </Link>

        </div>

      </section>

    </div>
  );
}