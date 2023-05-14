import {
  Box,
  Button,
  Grid,
  Paper,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ToastAlert from "../common/ToastAlert";
import {
  createProductReview,
  updateProductReview,
} from "../../features/productsSlice";
import ReviewCard from "./ReviewCard";

const Review = () => {
  const { item } = useSelector((state) => state?.products);
  const { _id } = useSelector((state) => state?.auth);
  const [ratingValue, setRatingValue] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewId, setReviewId] = useState("");
  const dispatch = useDispatch();
  const { id } = useParams();

  //   console.log(isUserReviewed);

  useEffect(() => {
    if (reviewId) {
      const review = item.comments.find((comment) => comment._id === reviewId);
      setRatingValue(review.rating);
      setComment(review.comment);
    }
    return () => {
      setRatingValue(0);
      setComment("");
    };
  }, [item.comments, reviewId]);

  const submitReview = (e) => {
    e.preventDefault();
    if (!ratingValue)
      return ToastAlert({
        type: "error",
        message: "Please select a rating",
        position: "top-center",
      });
    if (!comment)
      return ToastAlert({
        type: "error",
        message: "Please write a comment",
        position: "top-center",
      });

    if (reviewId) {
      const review = {
        productId: id,
        reviewId,
        rating: ratingValue,
        comment: comment,
      };
      dispatch(updateProductReview({ data: review }));
      setReviewId("");
    } else {
      const review = {
        id,
        rating: ratingValue,
        comment: comment,
      };
      dispatch(createProductReview({ data: review }));
    }
    setRatingValue(0);
    setComment("");
  };

  return (
    <Box>
      <Typography variant="h6">Reviews</Typography>

      {_id ? (
        <Grid container spacing={3} mb={2}>
          <Grid item xs={12}>
            <Paper
              sx={{
                padding: 2,
                marginY: "15px",
              }}
            >
              <Box
                component={"form"}
                my={4}
                onSubmit={submitReview}
                sx={{
                  all: "unset",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textTransform: "uppercase",
                    margin: "15px 0",
                  }}
                >
                  <Rating
                    size="large"
                    value={ratingValue}
                    onChange={(e) => {
                      setRatingValue(parseInt(e.target.value));
                    }}
                    precision={1}
                    sx={{
                      textAlign: "center",
                      marginLeft: "10px",
                      "& label": {
                        color: "gold",
                        fontSize: "2.2rem",
                      },
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <TextField
                    multiline={true}
                    rows={3}
                    fullWidth
                    label="Write a review!"
                    variant="outlined"
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                    }}
                  />
                  <Button
                    fullWidth
                    sx={{
                      height: "40px",
                      marginTop: "2rem",
                      textTransform: "capitalize",
                      width: "100%",
                    }}
                    type="submit"
                  >
                    {reviewId ? "Update Review" : "Submit Review"}
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Typography
          variant="body"
          component="div"
          sx={{
            mt: 2,
            mb: 3,
            textTransform: "capitalize",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          please{" "}
          <Link to="/login" style={{ color: "navy" }}>
            login
          </Link>{" "}
          or{" "}
          <Link to="/register" style={{ color: "navy" }}>
            register
          </Link>{" "}
          to post a review
        </Typography>
      )}

      <ReviewCard
        setReviewId={setReviewId}
        comments={item.comments}
        userId={_id}
      />
    </Box>
  );
};

export default Review;
