import fs from 'fs';
import path from 'path';

const map = {
  layout: ['Navbar.tsx', 'Footer.tsx', 'StickyBottomBar.tsx', 'DesktopSideMenu.tsx'],
  sections: ['Hero.tsx', 'AcademicHub.tsx', 'Programs.tsx', 'ProgramDetails.tsx', 'Admissions.tsx', 'AIPropTech.tsx', 'CaseStudies.tsx', 'FAQ.tsx', 'Faculty.tsx', 'IndustryMentors.tsx', 'Outcomes.tsx', 'IncubatorStories.tsx', 'Blogs.tsx', 'CounterStrip.tsx', 'TrustMarquee.tsx'],
  ui: ['Logo.tsx', 'ThemeToggle.tsx', 'Chatbot.tsx', 'InternshipPopup.tsx'],
  admin: ['AdminDashboard.tsx', 'AdminLoginModal.tsx']
};

const srcDir = path.resolve('src');
const componentsDir = path.join(srcDir, 'components');

// Create directories
Object.keys(map).forEach(dir => {
  const targetDir = path.join(componentsDir, dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
});

// Move files
const fileToDir = {};
Object.entries(map).forEach(([dir, files]) => {
  files.forEach(file => {
    fileToDir[file] = dir;
    const oldPath = path.join(componentsDir, file);
    const newPath = path.join(componentsDir, dir, file);
    if (fs.existsSync(oldPath)) {
      fs.renameSync(oldPath, newPath);
      console.log(`Moved ${file} to ${dir}`);
    }
  });
});

// Helper function to update imports in a file
function updateImports(filePath, isAppTsx = false, currentDir = null) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  Object.entries(fileToDir).forEach(([file, dir]) => {
    const baseName = file.replace('.tsx', '');
    
    if (isAppTsx) {
      // In App.tsx, import was './components/File' -> './components/dir/File'
      const oldImport1 = new RegExp(`from\\s+['"]\\./components/${baseName}['"]`, 'g');
      if (oldImport1.test(content)) {
        content = content.replace(oldImport1, `from './components/${dir}/${baseName}'`);
        changed = true;
      }
    } else {
      // Inside a component
      // import was './File' or '../components/File'
      // If current file is in 'dirA' and target is in 'dirB':
      // From 'dirA', target is '../dirB/File'
      let oldImport1 = new RegExp(`from\\s+['"]\\./${baseName}['"]`, 'g');
      let oldImport2 = new RegExp(`from\\s+['"]\\.\\./${baseName}['"]`, 'g');
      
      const newImport = `from '../${dir}/${baseName}'`;

      if (oldImport1.test(content)) {
        content = content.replace(oldImport1, newImport);
        changed = true;
      }
      if (oldImport2.test(content)) {
        content = content.replace(oldImport2, newImport);
        changed = true;
      }
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Updated imports in ${path.basename(filePath)}`);
  }
}

// Update App.tsx
updateImports(path.join(srcDir, 'App.tsx'), true);

// Update all components in their new locations
Object.entries(map).forEach(([dir, files]) => {
  files.forEach(file => {
    const filePath = path.join(componentsDir, dir, file);
    if (fs.existsSync(filePath)) {
      updateImports(filePath, false, dir);
    }
  });
});

console.log('Refactoring complete.');
