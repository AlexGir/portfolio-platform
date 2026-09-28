import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Expertise } from '@/components/sections/expertise';
import { WorkPreview } from '@/components/sections/work-preview';
import { Contact } from '@/components/sections/contact';

/**
 * Order: work, then capabilities, then the person.
 *
 * A recruiter scanning a portfolio is looking for the work, not the biography.
 * Putting the case studies directly under the hero means the highest-value
 * content sits at the entry point, and the context sections serve whoever is
 * already interested. This is also the order the header nav has always
 * advertised — the page used to contradict it.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="content">
        <Hero />
        <WorkPreview />
        <Expertise />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
