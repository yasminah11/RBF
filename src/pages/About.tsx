import { useI18n } from "@/i18n/I18nContext";
import { Ornament } from "@/components/Ornament";

export default function About() {
  const { locale } = useI18n();
  const content = {
    en: {
      title: "Royal Brands Fashion",
      body: "Royal Brands Fashion is a refined house of couture, founded on the belief that true luxury is timeless. Every piece is crafted with reverence for tradition and an unwavering commitment to modern elegance — from the silk of an evening gown to the gold of a hand-finished button.",
    },
    ar: {
      title: "رويال براندز فاشن",
      body: "رويال براندز فاشن دار أزياء راقية، تأسست على الإيمان بأن الفخامة الحقيقية خالدة. تُصنع كل قطعة بعناية فائقة، احتراماً للتقاليد والتزاماً ثابتاً بالأناقة المعاصرة.",
    },
    tr: {
      title: "Royal Brands Fashion Hakkında",
      body: "Royal Brands Fashion, gerçek lüksün zamansız olduğu inancı üzerine kurulmuş zarif bir kotür evidir. Her parça, geleneğe saygı ve modern zarafete kararlı bir bağlılıkla özenle üretilir.",
    },
  }[locale];

  return (
    <div className="container-luxury py-20 max-w-3xl">
      <div className="text-center">
        <h1 className="font-display text-5xl text-cream">{content.title}</h1>
        <Ornament />
      </div>
      <p className="text-lg text-foreground/80 leading-loose text-center">{content.body}</p>
    </div>
  );
}
