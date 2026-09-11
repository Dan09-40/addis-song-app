import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchStatsStart } from '../features/songsSlice';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

const KpiCard = styled.div<{ color: string }>`
  background: rgba(30, 41, 59, 0.75);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.color};
  }
`;

const KpiIcon = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${props => props.color}22;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
`;

const KpiMeta = styled.div`
  display: flex;
  flex-direction: column;
`;

const KpiValue = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.1;
`;

const KpiLabel = styled.div`
  font-size: 0.82rem;
  color: #94a3b8;
  font-weight: 600;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const HighlightsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
`;

const HighlightCard = styled.div`
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%);
  border: 1px solid rgba(168, 85, 247, 0.25);
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HighlightTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const HighlightTitle = styled.div`
  font-size: 0.8rem;
  color: #c084fc;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const HighlightValue = styled.div`
  font-size: 1.35rem;
  font-weight: 700;
  color: #ffffff;
`;

const SectionContainer = styled.div`
  background: rgba(30, 41, 59, 0.75);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const SectionHeader = styled.h3`
  margin: 0 0 20px 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const GenreList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const GenreItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const GenreMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  font-weight: 600;
  color: #cbd5e1;
`;

const ProgressBarBg = styled.div`
  height: 10px;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const ProgressBarFill = styled.div<{ percentage: number; colorIndex: number }>`
  height: 100%;
  width: ${props => props.percentage}%;
  background: ${props => {
    const colors = [
      'linear-gradient(90deg, #6366f1, #a855f7)',
      'linear-gradient(90deg, #3b82f6, #06b6d4)',
      'linear-gradient(90deg, #10b981, #34d399)',
      'linear-gradient(90deg, #f59e0b, #fbbf24)',
      'linear-gradient(90deg, #ec4899, #f43f5e)'
    ];
    return colors[props.colorIndex % colors.length];
  }};
  border-radius: 5px;
  transition: width 0.6s ease-out;
`;

const GridTwoCol = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
`;

const StatCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 340px;
  overflow-y: auto;
  padding-right: 6px;

  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

const ListItemCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;

  &:hover {
    background: rgba(15, 23, 42, 0.8);
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ItemTitle = styled.span`
  font-weight: 600;
  color: #f8fafc;
  font-size: 0.92rem;
`;

const ItemSub = styled.span`
  font-size: 0.78rem;
  color: #94a3b8;
`;

const TagBadge = styled.span`
  padding: 4px 10px;
  border-radius: 12px;
  background: rgba(99, 102, 241, 0.15);
  color: #a5b4fc;
  font-size: 0.8rem;
  font-weight: 700;
`;

const LoadingState = styled.div`
  padding: 60px;
  text-align: center;
  color: #94a3b8;
  font-size: 1.1rem;
`;

export const StatsView: React.FC = () => {
  const dispatch = useDispatch();
  const stats = useSelector((state: RootState) => state.songs.stats);

  useEffect(() => {
    dispatch(fetchStatsStart());
  }, [dispatch]);

  if (!stats) return <LoadingState>⏳ Loading statistics & metrics...</LoadingState>;

  const totalSongs = stats.totals.songs || 1;

  return (
    <DashboardContainer>
      <KpiGrid>
        <KpiCard color="#6366f1">
          <KpiIcon color="#6366f1">🎵</KpiIcon>
          <KpiMeta>
            <KpiValue>{stats.totals.songs}</KpiValue>
            <KpiLabel>Total Songs</KpiLabel>
          </KpiMeta>
        </KpiCard>

        <KpiCard color="#3b82f6">
          <KpiIcon color="#3b82f6">🎤</KpiIcon>
          <KpiMeta>
            <KpiValue>{stats.totals.artists}</KpiValue>
            <KpiLabel>Total Artists</KpiLabel>
          </KpiMeta>
        </KpiCard>

        <KpiCard color="#10b981">
          <KpiIcon color="#10b981">💿</KpiIcon>
          <KpiMeta>
            <KpiValue>{stats.totals.albums}</KpiValue>
            <KpiLabel>Total Albums</KpiLabel>
          </KpiMeta>
        </KpiCard>

        <KpiCard color="#f59e0b">
          <KpiIcon color="#f59e0b">🎷</KpiIcon>
          <KpiMeta>
            <KpiValue>{stats.totals.genres}</KpiValue>
            <KpiLabel>Total Genres</KpiLabel>
          </KpiMeta>
        </KpiCard>
      </KpiGrid>

      <HighlightsRow>
        <HighlightCard>
          <HighlightTextGroup>
            <HighlightTitle>🌟 Top Featured Artist</HighlightTitle>
            <HighlightValue>{stats.topArtist || 'N/A'}</HighlightValue>
          </HighlightTextGroup>
          <span style={{ fontSize: '32px' }}>👑</span>
        </HighlightCard>

        <HighlightCard style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)', borderColor: 'rgba(6, 182, 212, 0.25)' }}>
          <HighlightTextGroup>
            <HighlightTitle style={{ color: '#38bdf8' }}>🔥 Dominant Genre</HighlightTitle>
            <HighlightValue>{stats.topGenre || 'N/A'}</HighlightValue>
          </HighlightTextGroup>
          <span style={{ fontSize: '32px' }}>🎸</span>
        </HighlightCard>
      </HighlightsRow>

      <SectionContainer>
        <SectionHeader>📊 Songs Count by Genre</SectionHeader>
        <GenreList>
          {stats.genreStats.map((g, idx) => {
            const percentage = Math.round((g.count / totalSongs) * 100);
            return (
              <GenreItem key={g._id}>
                <GenreMeta>
                  <span>{g._id}</span>
                  <span>{g.count} songs ({percentage}%)</span>
                </GenreMeta>
                <ProgressBarBg>
                  <ProgressBarFill percentage={percentage} colorIndex={idx} />
                </ProgressBarBg>
              </GenreItem>
            );
          })}
        </GenreList>
      </SectionContainer>

      <GridTwoCol>
        <SectionContainer>
          <SectionHeader>🎤 Artist Performance (# Songs & Albums)</SectionHeader>
          <StatCardList>
            {stats.artistStats.map(artist => (
              <ListItemCard key={artist._id}>
                <ItemInfo>
                  <ItemTitle>{artist.artist || artist._id}</ItemTitle>
                  <ItemSub>{artist.totalAlbums} unique album{artist.totalAlbums === 1 ? '' : 's'}</ItemSub>
                </ItemInfo>
                <TagBadge>{artist.totalSongs} song{artist.totalSongs === 1 ? '' : 's'}</TagBadge>
              </ListItemCard>
            ))}
          </StatCardList>
        </SectionContainer>

        <SectionContainer>
          <SectionHeader>💿 Album Breakdown (# Songs in each Album)</SectionHeader>
          <StatCardList>
            {stats.albumStats.map(album => (
              <ListItemCard key={album._id}>
                <ItemInfo>
                  <ItemTitle>💿 {album._id}</ItemTitle>
                  <ItemSub>Album Catalog</ItemSub>
                </ItemInfo>
                <TagBadge>{album.totalSongs} song{album.totalSongs === 1 ? '' : 's'}</TagBadge>
              </ListItemCard>
            ))}
          </StatCardList>
        </SectionContainer>
      </GridTwoCol>
    </DashboardContainer>
  );
};