import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PlayChallenges from './components/PlayChallenges';
import Quizzes from './components/Quizzes';
import UsefulWebsites from './components/UsefulWebsites';
import Books from './components/Books';
import Quit from './components/Quit';
import PhishingDefense3D from './components/PhishingDefense3D';
import EncryptAndDecrypt from './components/EncryptAndDecrypt';
import SQL from './components/SQL';
import MITM from './components/MITM';
import Intro from './components/Intro';
import TFA from './components/TFA';
import PasswordTester from './components/PasswordTester';
import DFS from './components/DFS';
import BFA from './components/BFA';
import DDOS from './components/DDOS';
import CHS from './components/CHS';
import XSS from './components/XSS';

import ModuleSelect from './shared/components/ModuleSelect';
import CultivationGame from './modules/cultivation/CultivationGame';
import VulnLab from './modules/vuln-lab/VulnLab';
import IncidentResponse from './modules/incident-response/IncidentResponse';
import Arena from './modules/arena/Arena';

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div className="min-h-screen bg-[#0B0F19] relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 pointer-events-none"
          style={{
            backgroundImage: 'url("https://i.ibb.co/JW83rLVJ/BG.png")',
          }}
        />

        <Routes>
          <Route path="/" element={<ModuleSelect />} />
          <Route path="/play-challenges" element={<PlayChallenges />} />
          <Route path="/intro-cybersecurity" element={<PlayChallenges />} />
          <Route path="/quizes" element={<Quizzes />} />
          <Route path="/useful-websites" element={<UsefulWebsites />} />
          <Route path="/books" element={<Books />} />
          <Route path="/quit" element={<Quit />} />
          <Route path="/phishing-defense-3d" element={<PhishingDefense3D />} />
          <Route path="/encrypt-decrypt-1d" element={<EncryptAndDecrypt/>}/>
          <Route path="/sql-injection-1d" element={<SQL/>}/>
          <Route path="/MITM-1d" element={<MITM/>}/>
          <Route path="/Intro-1d" element={<Intro/>}/>
          <Route path="/TFA-1d" element={<TFA/>}/>
          <Route path="/PT-1d" element={<PasswordTester/>}/>
          <Route path="/DFS-1d" element={<DFS/>}/>
          <Route path="/BFA-1d" element={<BFA/>}/>
          <Route path="/CHS-1d" element={<CHS/>}/>
          <Route path="/DDOS-1d" element={<DDOS/>}/>
          <Route path="/XSS-1d" element={<XSS/>}/>

          <Route path="/cultivation" element={<CultivationGame />} />
          <Route path="/vuln-lab" element={<VulnLab />} />
          <Route path="/incident-response" element={<IncidentResponse />} />
          <Route path="/arena" element={<Arena />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
