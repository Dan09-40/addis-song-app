import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  deleteSongStart,
  fetchSongsStart,
  setEditingSong,
  setSelectedGenre,
  setSearchTerm,
  seedSongsStart,
  openModal
} from '../features/songsSlice';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ControlBar = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  padding: 16px 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
`;

const SearchInputGroup = styled.div`
  position: relative;
  flex: 1;
  min-width: 240px;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 1rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px 10px 40px;
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #f8fafc;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }

  &::placeholder {
    color: #64748b;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: rgba(15, 23, 42, 0.6);
  padding: 4px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const ViewBtn = styled.button<{ active: boolean }>`
  padding: 6px 14px;
  background: ${props => (props.active ? '#6366f1' : 'transparent')};
  color: ${props => (props.active ? '#ffffff' : '#94a3b8')};
  border: none;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
  }
`;

const GenrePillsContainer = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  align-items: center;

  ::-webkit-scrollbar {
    height: 4px;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
`;

const GenrePill = styled.button<{ active: boolean }>`
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid ${props => (props.active ? '#6366f1' : 'rgba(255, 255, 255, 0.1)')};
  background: ${props => (props.active ? 'rgba(99, 102, 241, 0.25)' : 'rgba(30, 41, 59, 0.6)')};
  color: ${props => (props.active ? '#a5b4fc' : '#94a3b8')};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;

  &:hover {
    border-color: #6366f1;
    color: #ffffff;
  }
`;

const TableContainer = styled.div`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  padding: 16px 20px;
  background: rgba(15, 23, 42, 0.8);
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
`;

const Tr = styled.tr`
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Td = styled.td`
  padding: 16px 20px;
  color: #f8fafc;
  font-size: 0.92rem;
`;

const SongTitle = styled.div`
  font-weight: 600;
  color: #f8fafc;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TrackIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  background: rgba(99, 102, 241, 0.12);
  color: #a5b4fc;
  font-size: 0.78rem;
  font-weight: 600;
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionBtn = styled.button<{ danger?: boolean }>`
  padding: 6px 12px;
  background: ${props => (props.danger ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)')};
  color: ${props => (props.danger ? '#fca5a5' : '#a5b4fc')};
  border: 1px solid ${props => (props.danger ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)')};
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${props => (props.danger ? '#ef4444' : '#6366f1')};
    color: #ffffff;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
`;

const Card = styled.div`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(16px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(99, 102, 241, 0.4);
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const CardIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
`;

const CardMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardTitle = styled.div`
  font-size: 1.05rem;
  font-weight: 700;
  color: #f8fafc;
`;

const CardArtist = styled.div`
  font-size: 0.88rem;
  color: #94a3b8;
`;

const CardAlbum = styled.div`
  font-size: 0.82rem;
  color: #64748b;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 12px;
`;

const EmptyState = styled.div`
  padding: 60px 20px;
  text-align: center;
  background: rgba(30, 41, 59, 0.5);
  border-radius: 16px;
  border: 1px dashed rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  opacity: 0.6;
`;

const EmptyText = styled.div`
  color: #94a3b8;
  font-size: 1rem;
`;

const PrimaryBtn = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);

  &:hover {
    box-shadow: 0 6px 20px rgba(99, 102, 241, 0.6);
  }
`;

export const SongList: React.FC = () => {
  const dispatch = useDispatch();
  const { songs, stats, selectedGenre, searchTerm } = useSelector((state: RootState) => state.songs);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');


  const genresList = stats?.genreStats?.map(g => g._id) || [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    dispatch(setSearchTerm(term));
    dispatch(fetchSongsStart({ genre: selectedGenre, search: term }));
  };

  const handleGenreClick = (genre: string) => {
    dispatch(setSelectedGenre(genre));
    dispatch(fetchSongsStart({ genre, search: searchTerm }));
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      dispatch(deleteSongStart(id));
    }
  };

  return (
    <Container>
      <ControlBar>
        <SearchInputGroup>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            type="text"
            placeholder="Search by title, artist, album, or genre..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </SearchInputGroup>

        <ViewToggle>
          <ViewBtn active={viewMode === 'table'} onClick={() => setViewMode('table')}>
            📋 Table
          </ViewBtn>
          <ViewBtn active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>
            🎴 Cards
          </ViewBtn>
        </ViewToggle>
      </ControlBar>

      <GenrePillsContainer>
        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginRight: '4px' }}>
          Filter Genre:
        </span>
        <GenrePill active={selectedGenre === ''} onClick={() => handleGenreClick('')}>
          All Genres ({stats?.totals.songs || songs.length})
        </GenrePill>
        {genresList.map(g => (
          <GenrePill key={g} active={selectedGenre === g} onClick={() => handleGenreClick(g)}>
            {g}
          </GenrePill>
        ))}
      </GenrePillsContainer>

      {songs.length === 0 ? (
        <EmptyState>
          <EmptyIcon>🎶</EmptyIcon>
          <EmptyText>
            {searchTerm || selectedGenre
              ? 'No songs match your search or filter criteria.'
              : 'No songs found in your library catalog.'}
          </EmptyText>
          <div style={{ display: 'flex', gap: '12px' }}>
            <PrimaryBtn onClick={() => dispatch(openModal())}>➕ Add First Song</PrimaryBtn>
            <PrimaryBtn
              style={{ background: 'rgba(255, 255, 255, 0.1)', boxShadow: 'none' }}
              onClick={() => dispatch(seedSongsStart())}
            >
              🌱 Seed Demo Tracks
            </PrimaryBtn>
          </div>
        </EmptyState>
      ) : viewMode === 'table' ? (
        <TableContainer>
          <Table>
            <thead>
              <Tr>
                <Th>Title</Th>
                <Th>Artist</Th>
                <Th>Album</Th>
                <Th>Genre</Th>
                <Th style={{ textAlign: 'right' }}>Actions</Th>
              </Tr>
            </thead>
            <tbody>
              {songs.map(song => (
                <Tr key={song._id}>
                  <Td>
                    <SongTitle>
                      <TrackIcon>🎧</TrackIcon>
                      {song.title}
                    </SongTitle>
                  </Td>
                  <Td>{song.artist}</Td>
                  <Td>{song.album}</Td>
                  <Td>
                    <Badge>{song.genre}</Badge>
                  </Td>
                  <Td style={{ textAlign: 'right' }}>
                    <ActionButtonGroup style={{ justifyContent: 'flex-end' }}>
                      <ActionBtn onClick={() => dispatch(setEditingSong(song))}>✏️ Edit</ActionBtn>
                      <ActionBtn
                        danger
                        onClick={() => song._id && handleDelete(song._id, song.title)}
                      >
                        🗑️ Delete
                      </ActionBtn>
                    </ActionButtonGroup>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      ) : (
        <Grid>
          {songs.map(song => (
            <Card key={song._id}>
              <CardHeader>
                <CardIcon>🎵</CardIcon>
                <CardMeta>
                  <CardTitle>{song.title}</CardTitle>
                  <CardArtist>🎤 {song.artist}</CardArtist>
                  <CardAlbum>💿 {song.album}</CardAlbum>
                </CardMeta>
              </CardHeader>
              <CardFooter>
                <Badge>{song.genre}</Badge>
                <ActionButtonGroup>
                  <ActionBtn onClick={() => dispatch(setEditingSong(song))}>Edit</ActionBtn>
                  <ActionBtn danger onClick={() => song._id && handleDelete(song._id, song.title)}>
                    Delete
                  </ActionBtn>
                </ActionButtonGroup>
              </CardFooter>
            </Card>
          ))}
        </Grid>
      )}
    </Container>
  );
};