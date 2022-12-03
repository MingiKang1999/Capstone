function Rating(props) {
    const {rating, reviewedNumber} = props;
    return (
        <div className="rating">
            <span>
                <i className={rating>=1
                ?"fas fa-star": "far fa-star"}
                />
            </span>
            <span>
                <i className={rating>=2
                ?"fas fa-star": "far fa-star"}
                />
            </span>
            <span>
                <i className={rating>=3
                ?"fas fa-star": "far fa-star"}
                />
            </span>
            <span>
                <i className={rating>=4
                ?"fas fa-star": "far fa-star"}
                />
            </span>
            <span>
                <i className={rating>=5
                ?"fas fa-star": "far fa-star"}
                />
            </span>
            <span className="reviewedNum">
                {reviewedNumber} Reviews
            </span>
        </div>
    )
}

export default Rating;