import React from 'react';
import Hero from './sections/Hero';
import CounterStrip from './sections/CounterStrip';
import TrustMarquee from './sections/TrustMarquee';
import HomeSections from './sections/HomeSections';

export default function HomeView() {
  return (
    <>
      <Hero />
      <CounterStrip />
      <TrustMarquee />
      <HomeSections />
    </>
  );
}
