import './Pagination.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function Pagination({ page, totalPages, setCurrentPage }) {

    console.log(page, totalPages, setCurrentPage, "props dans pagination")

    const [pages, setPages] = useState([]);

    useEffect(() => {
        const pagesArray = [];
        for (let i = 1; i <= totalPages; i++) {
            pagesArray.push(i);
        }
        setPages(pagesArray);
    }, [totalPages]);

    return (
        <div className="pagination">
            <ul>
                {pages.map((pageNumber) => (
                    <li key={pageNumber}>
                        <Link
                            to={`/?page=${pageNumber}`}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={pageNumber === page ? 'active' : ''}
                        >
                            {pageNumber}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
