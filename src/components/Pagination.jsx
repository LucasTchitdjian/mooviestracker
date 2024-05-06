import './Pagination.css';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa";

export function Pagination({ page, totalPages, setCurrentPage, context }) {

    const [pages, setPages] = useState([]);
    const [startPage, setStartPage] = useState(1);
    const [endPage, setEndPage] = useState(10);

    const handleNext = () => {
        if (endPage < totalPages) {
            setStartPage(startPage + 10);
            setEndPage(Math.min(endPage + 10, totalPages));
        }
    }

    const handlePrevious = () => {
        if (startPage > 1) {
            setStartPage(Math.max(1, startPage - 10));
            setEndPage(startPage - 1);
        }
    }

    useEffect(() => {
        const pagesArray = [];
        for (let i = startPage; i <= Math.min(endPage, totalPages); i++) {
            pagesArray.push(i);
        }
        setPages(pagesArray);
    }, [totalPages, endPage, startPage]);

    return (
        <div className="pagination">
            <ul>
                {startPage > 1 && (
                    <li>
                        <Link
                            onClick={() => handlePrevious()}>
                            <FaArrowLeft />
                        </Link>
                    </li>
                )}
                {pages.map((pageNumber) => (
                    <li key={pageNumber}>
                        <Link
                            to={`/${context}/?page=${pageNumber}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(pageNumber);
                            }}
                            className={`pages ${pageNumber === page ? 'active' : ''}`}
                        >
                            {pageNumber}
                        </Link>
                    </li>
                ))}
                <li>
                    <Link className='points'>
                        ...
                    </Link>
                </li>
                <li>
                    <Link
                        to={`/${context}/?page=${totalPages}`}
                        onClick={() => setCurrentPage(totalPages)}
                        className='pages'
                    >
                        {totalPages}
                    </Link>
                </li>
                <li>
                    <Link
                        onClick={() => handleNext()}>
                        <FaArrowRight />
                    </Link>
                </li>
            </ul>
        </div>
    );
}
