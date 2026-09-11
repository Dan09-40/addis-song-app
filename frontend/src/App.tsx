import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import { useDispatch } from 'react-redux';
import { fetchSongsStart, fetchStatsStart } from './features/songsSlice';
import { Header } from './components/Header';
import { SongList } from './components/SongList';
import { StatsView } from './components/StatsView';
import { SongFormModal } from './components/SongFormModal';
import { NotificationToast } from './components/NotificationToast';

const globalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #0f172a;
    background-image: 
      radial-gradient(at 0% 0%, rgba(99, 102, 241, 0.18) 0px, transparent 50%),
      radial-gradient(at 100% 0%, rgba(168, 85, 247, 0.18) 0px, transparent 50%),
      radial-gradient(at 50% 100%, rgba(236, 72, 153, 0.12) 0px, transparent 50%);
    background-attachment: fixed;
    color: #f8fafc;
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }
`;

const AppLayout = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 30px 20px;
`;

const Footer = styled.footer`
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  font-size: 0.85rem;
  color: #64748b;
`;

export const App: React.FC = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState<'library' | 'stats'>('library');

  useEffect(() => {
    dispatch(fetchSongsStart({}));
    dispatch(fetchStatsStart());
  }, [dispatch]);

  return (
    <>
      <Global styles={globalStyles} />
      <AppLayout>
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main>
          {activeTab === 'library' ? <SongList /> : <StatsView />}
        </main>

        <SongFormModal />
        <NotificationToast />

        <Footer>
          Addis Software Test Project — Full Stack MERN (MongoDB, Express, React, Node, Redux Toolkit, Saga & Emotion)
        </Footer>
      </AppLayout>
    </>
  );
};

export default App;