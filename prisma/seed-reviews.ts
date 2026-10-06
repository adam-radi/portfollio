import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding reviews...\n");

  const reviews = [
    {
      name: "Karim Bensalem",
      role: "Startup Founder",
      company: "NexaLab",
      content:
        "Adam delivered our landing page and dashboard in record time. The code quality was impeccable — clean, well-structured, and easy to extend. He communicated clearly at every step and handled feedback without any friction. Genuinely one of the best freelancers I've worked with.",
      rating: 5,
      linkedinUrl: null,
      websiteUrl: null,
      source: "REFERRAL" as const,
      status: "APPROVED" as const,
    },
    {
      name: "Sofia Marrakchi",
      role: "Product Manager",
      company: "DigitOps Agency",
      content:
        "We hired Adam to rebuild our client portal in Next.js. He quickly understood our requirements, proposed smart technical solutions, and shipped everything on schedule. The UI looks polished and our clients noticed the difference immediately. Highly recommended.",
      rating: 5,
      linkedinUrl: null,
      websiteUrl: null,
      source: "LINKEDIN" as const,
      status: "APPROVED" as const,
    },
    {
      name: "Yassine El Fassi",
      role: "IT Director",
      company: "MedTech Maroc",
      content:
        "Adam provided both IT support and full-stack development for our internal tools. His dual expertise saved us a lot of back-and-forth. He is methodical, reliable, and always brings practical suggestions that save time and money. We will definitely work together again.",
      rating: 5,
      linkedinUrl: null,
      websiteUrl: null,
      source: "GOOGLE_SEARCH" as const,
      status: "APPROVED" as const,
    },
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
    console.log(`✅ Created review from ${review.name}`);
  }

  console.log("\n🎉 Reviews seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
