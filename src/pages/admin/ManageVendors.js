import React, { useState, useEffect } from 'react';
import { getVendorReviews, getUsers } from '../../services/VendorReviewService'; // Import both API calls
import './ManageVendors.scss';
import { FaStar } from 'react-icons/fa'; // Import star icons
import Modal from 'react-modal';

const ManageVendors = () => {
  const [vendors, setVendors] = useState([]); // Store all vendors
  const [selectedVendorReviews, setSelectedVendorReviews] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedVendorName, setSelectedVendorName] = useState('');
  const [sortOrder, setSortOrder] = useState('highest'); // Default sort order

  useEffect(() => {
    fetchVendorsAndReviews();
  }, []);

  const fetchVendorsAndReviews = async () => {
    try {
      // Fetch all vendors
      const usersResponse = await getUsers();
      const allVendors = usersResponse.data.filter(user => user.role === 'Vendor');

      // Fetch vendor reviews
      const reviewsResponse = await getVendorReviews();
      const groupedVendorsWithReviews = groupReviewsByVendor(reviewsResponse.data);

      // Combine vendors with reviews and those without
      const combinedVendorData = allVendors.map((vendor) => {
        const reviewData = groupedVendorsWithReviews[vendor.id] || {
          vendorName: vendor.name,
          vendorId: vendor.id,
          reviews: [],
          ratingStats: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
          averageRating: 0, // Default to 0 if no reviews
        };
        return reviewData;
      });

      setVendors(combinedVendorData);
    } catch (error) {
      console.error('Error fetching vendors or reviews:', error);
    }
  };

  // Group reviews by vendorId and calculate average rating and statistics
  const groupReviewsByVendor = (reviewsData) => {
    const grouped = reviewsData.reduce((acc, current) => {
      const { vendorId, vendorName, review } = current;
      if (!acc[vendorId]) {
        acc[vendorId] = {
          vendorName,
          vendorId,
          reviews: [],
          ratingStats: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
          },
        };
      }
      acc[vendorId].reviews.push(review);
      acc[vendorId].ratingStats[review.rating] += 1;
      return acc;
    }, {});

    // Calculate the average rating for each vendor
    Object.values(grouped).forEach((vendor) => {
      vendor.averageRating = calculateAverageRating(vendor.reviews);
    });

    return grouped;
  };

  // Calculate the average rating for each vendor
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return totalRating / reviews.length;
  };

  // Open modal for detailed reviews of the vendor
  const openModal = (vendorName, vendorReviews) => {
    setSelectedVendorReviews(vendorReviews);
    setSelectedVendorName(vendorName);
    setModalIsOpen(true); // Ensure modal opens
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedVendorReviews([]);
  };

  // Sorting the reviews based on the selected sort order
  const sortReviews = (order) => {
    const sortedReviews = [...selectedVendorReviews].sort((a, b) => {
      return order === 'lowest' ? a.rating - b.rating : b.rating - a.rating;
    });
    setSelectedVendorReviews(sortedReviews);
    setSortOrder(order);
  };

  return (
    <div className="manage-vendors-container">
      <h2>Vendor Reviews</h2>
      <div className="cards-container">
        {vendors.length > 0 ? (
          vendors.map((vendor) => {
            const { vendorName, vendorId, averageRating = 0, ratingStats } = vendor;
            const totalReviews = Object.values(ratingStats).reduce((acc, curr) => acc + curr, 0); // Calculate total reviews inside loop

            return (
              <div className="vendor-card" key={vendorId} onClick={() => openModal(vendorName, vendor.reviews)}>
                <div className="average-rating-section">
                  <h3>{vendorName || 'Unknown Vendor'}</h3>
                  <div className="rating-number">{averageRating.toFixed(1)}</div>
                  <div className="star-rating">
                    {[...Array(5)].map((star, index) => (
                      <FaStar key={index} className={index < averageRating ? 'filled-star' : ''} />
                    ))}
                  </div>
                </div>

                {/* Review distribution */}
                <div className="rating-distribution">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div key={star} className="rating-bar">
                      <span className="star-label">{star}</span>
                      <div className="bar">
                        <div
                          className="bar-filled"
                          style={{ width: `${totalReviews > 0 ? (vendor.ratingStats[star] / totalReviews) * 100 : 100}%`, backgroundColor: totalReviews === 0 ? 'gray' : 'green' }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="total-reviews">{totalReviews} reviews</div>
              </div>
            );
          })
        ) : (
          <p>No vendor reviews available</p>
        )}
      </div>

      {/* Modal for detailed reviews */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="review-modal">
        <h3>{selectedVendorName} - Detailed Reviews</h3>
        <div className="sort-buttons">
          <button onClick={() => sortReviews('highest')} className={sortOrder === 'highest' ? 'active' : ''}>
            Highest to Lowest
          </button>
          <button onClick={() => sortReviews('lowest')} className={sortOrder === 'lowest' ? 'active' : ''}>
            Lowest to Highest
          </button>
        </div>
        <div className="reviews-list">
          {selectedVendorReviews.length > 0 ? (
            selectedVendorReviews.map((review) => (
              <div key={review.id} className="review-item">
                <div className="review-rating">
                  {[...Array(5)].map((star, index) => (
                    <FaStar key={index} className={index < review.rating ? 'filled-star' : ''} />
                  ))}
                </div>
                <p>{review.comment}</p>
                <p className="review-date">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet</p> // Display message if no reviews
          )}
        </div>
        <button onClick={closeModal} className="close-modal-button">Close</button>
      </Modal>
    </div>
  );
};

export default ManageVendors;
