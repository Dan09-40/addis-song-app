import React from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { openModal, seedSongsStart } from '../features/songsSlice';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px;
  background: rgba(30, 41, 59, 0.8);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  flex-wrap: wrap;
  gap: 16px;
`;

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const LogoIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(90deg, #ffffff 0%, #cbd5e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.span`
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
`;

const NavTabs = styled.div`
  display: flex;
  gap: 8px;
  background: rgba(15, 23, 42, 0.6);
  padding: 6px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 8px 18px;
  border-radius: 8px;
  border: none;
  background: ${props => (props.active ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'transparent')};
  color: ${props => (props.active ? '#ffffff' : '#94a3b8')};
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: #ffffff;
    background: ${props => (props.active ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'rgba(255, 255, 255, 0.05)')};
  }
`;

const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AddBtn = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
  }

  &:active {
    transform: translateY(0);
  }
`;

const SeedBtn = styled.button`
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    color: #ffffff;
  }
`;

interface HeaderProps {
  activeTab: 'library' | 'stats';
  setActiveTab: (tab: 'library' | 'stats') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const dispatch = useDispatch();
  const stats = useSelector((state: RootState) => state.songs.stats);

  return (
    <HeaderContainer>
      <BrandSection>
        <LogoIcon>🎵</LogoIcon>
        <TitleGroup>
          <Title>Addis Music Hub</Title>
          <Subtitle>Full Stack MERN Song Catalog & Analytics</Subtitle>
        </TitleGroup>
      </BrandSection>

      <NavTabs>
        <TabButton active={activeTab === 'library'} onClick={() => setActiveTab('library')}>
          🎧 Songs Library {stats ? `(${stats.totals.songs})` : ''}
        </TabButton>
        <TabButton active={activeTab === 'stats'} onClick={() => setActiveTab('stats')}>
          📊 Analytics Dashboard
        </TabButton>
      </NavTabs>

      <ActionGroup>
        <SeedBtn onClick={() => dispatch(seedSongsStart())} title="Load sample Ethiopian & International hits">
          🌱 Seed Sample Data
        </SeedBtn>
        <AddBtn onClick={() => dispatch(openModal())}>
          <span>➕</span> Add New Song
        </AddBtn>
      </ActionGroup>
    </HeaderContainer>
  );
};
