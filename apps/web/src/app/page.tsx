import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { Expertise } from '@/components/sections/expertise';
import { Work } from '@/components/sections/work';
import { Contact } from '@/components/sections/contact';

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main id="content">
        <Hero />
        <About />
        <Expertise />
        <Work />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
