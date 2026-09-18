import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Expertise } from '@/components/sections/expertise';
import { WorkPreview } from '@/components/sections/work-preview';
import { Contact } from '@/components/sections/contact';

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="content">
        <Hero />
        <About />
        <Expertise />
        <WorkPreview />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
