import React from 'react';
import BestOfBothWorlds from './BestOfBothWorlds';
import WhyLotlite from './WhyLotlite';
import LotliteAdvantage from './LotliteAdvantage';
import Programs from './Programs';
import FocusAreas from './FocusAreas';
import CurriculumSnapshot from './CurriculumSnapshot';
import Outcomes from './Outcomes';
import PracticalLearning from './PracticalLearning';
import WhoShouldApply from './WhoShouldApply';
import Admissions from './Admissions';
import ParentFocus from './ParentFocus';
import FinalCTA from './FinalCTA';
import FAQ from './FAQ';
import GoogleReviews from './GoogleReviews';

// Existing Sections (temporarily hidden)
import Faculty from './Faculty';
import IndustryMentors from './IndustryMentors';
import IncubatorStories from './IncubatorStories';
import CaseStudies from './CaseStudies';
import Blogs from './Blogs';

const HomeSections: React.FC = () => {
  return (
    <div className="flex flex-col [&>section]:!py-12 md:[&>section]:!py-16">
      {/* Section 01: Hero (in parent layout) */}
      {/* Section 02: Best of Both Worlds */}
      <BestOfBothWorlds />
      {/* Section 03: Why Lotlite Edu */}
      <WhyLotlite />
      {/* Section 04: Lotlite Edu Advantage */}
      <LotliteAdvantage />
      {/* Section 05: Programmes Offered */}
      <Programs />
      {/* Section 14: Final CTA (Moved below programs offered as per request) */}
      <FinalCTA />
      {/* Section 06: Focus Areas */}
      <FocusAreas />
      {/* Section 07 & 08: Curriculum Snapshot (MBA + BBA) (Removed from Home Page as per request) */}
      {/* <CurriculumSnapshot /> */}
      {/* Section 09: Career Outcomes */}
      <Outcomes />
      {/* Section 10: Practical Learning */}
      <PracticalLearning />
      {/* Section 11: Who Should Apply */}
      <WhoShouldApply />
      {/* Section 12: Admissions (Removed from Home Page as per request) */}
      {/* <Admissions /> */}
      {/* Section 13: Parent Focused */}
      <ParentFocus />
      {/* FAQ */}
      <FAQ />

      {/* Hidden sections - kept for future use */}
      {/* <GoogleReviews /> */}
      {/* <Faculty /> */}
      {/* <IndustryMentors /> */}
      {/* <IncubatorStories /> */}
      {/* <CaseStudies /> */}
      {/* <Blogs /> */}
    </div>
  );
};

export default HomeSections;
