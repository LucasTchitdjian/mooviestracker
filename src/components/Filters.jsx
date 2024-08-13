import './Filters.css';
import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const genres = [
    'Action',
    'Animation',
    'Aventure',
    'Comédie',
    'Drame',
    'Fantastique',
    'Horreur',
    'Policier',
    'Science-fiction',
    'Thriller',
];

const years = [
    '2024',
    '2023',
    '2022',
    '2021',
    '2020',
    '2019',
    '2018',
    '2017',
    '2016',
    '2015',
    '2014',
    '2013',
    '2012',
    '2011',
    '2010',
];

export function Filters({ setYearFilter, setGenreFilter, yearFilter }) {
    const [genreName, setGenreName] = React.useState('Action');

    const handleYearFilter = (event) => {
        const selectedYear = event.target.value;
        setYearFilter(selectedYear);
    }

    const handleGenreFilter = (event) => {
        const selectedGenre = event.target.value;
        setGenreName(selectedGenre);
        const genreMapping = {
            'Action': '28',
            'Animation': '16',
            'Aventure': '12',
            'Comédie': '35',
            'Drame': '18',
            'Fantastique': '14',
            'Horreur': '27',
            'Policier': '80',
            'Science-fiction': '878',
            'Thriller': '53'
        };
        setGenreFilter(genreMapping[selectedGenre] || 'NA');
    }

    return (
        <div className="filter-wrapper">
            <div className="filters">
                <div className="filter">
                    <label htmlFor="year">Année</label>
                    <FormControl sx={{ m: 1, width: 200 }}>
                        <Select
                            displayEmpty
                            value={yearFilter}
                            onChange={handleYearFilter}
                            input={<OutlinedInput />}
                            MenuProps={MenuProps}
                            inputProps={{ 'aria-label': 'Sans label' }}
                            className="year-select"
                        >
                            <MenuItem disabled value="">
                                <em>Sélectionnez une année</em>
                            </MenuItem>
                            {years.map((year) => (
                                <MenuItem
                                    sx={{ marginBottom: '8px', fontFamily: 'Montserrat' }}
                                    key={year}
                                    value={year}
                                >
                                    {year}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="filter">
                    <label htmlFor="genre">Genre</label>
                    <FormControl sx={{ m: 1, width: 200 }}>
                        <Select
                            displayEmpty
                            value={genreName}
                            onChange={handleGenreFilter}
                            input={<OutlinedInput />}
                            MenuProps={MenuProps}
                            inputProps={{ 'aria-label': 'Sans label' }}
                            className="genre-select"
                        >
                            <MenuItem disabled value="">
                                <em>Sélectionnez un genre</em>
                            </MenuItem>
                            {genres.map((genre) => (
                                <MenuItem
                                    sx={{ marginBottom: '8px', fontFamily: 'Montserrat' }}
                                    className='genre-items'
                                    key={genre}
                                    value={genre}
                                >
                                    {genre}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>
            <div className="reset-btn">
                <button onClick={() => {
                    setYearFilter('2024');
                    setGenreFilter('');
                    setGenreName('');
                }}>Réinitialiser filtres</button>
            </div>
        </div>
    );
}
