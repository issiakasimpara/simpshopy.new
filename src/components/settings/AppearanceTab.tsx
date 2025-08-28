
import { ThemeSection } from "./sections/ThemeSection";
import { LanguageSection } from "./sections/LanguageSection";
import { DisplaySection } from "./sections/DisplaySection";
import { LivePreviewSection } from "./sections/LivePreviewSection";

export const AppearanceTab = () => {
  return (
    <div className="space-y-8">
      <ThemeSection />
      <LanguageSection />
      <DisplaySection />
      <LivePreviewSection />
    </div>
  );
};
