import {
  Avatar,
  Grid,
  Paper,
  Rating,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { deleteProductReview } from "../../features/productsSlice";
import { useDispatch } from "react-redux";
import { FaTrash, FaEdit } from "react-icons/fa";

const ReviewCard = ({ setReviewId, comments, userId }) => {
  const dispatch = useDispatch();

  const { id } = useParams();

  const handleDelete = (reviewId) => {
    const check = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!check) return;
    const data = {
      productId: id,
      reviewId,
    };
    dispatch(deleteProductReview({ data }));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        {comments && comments ? (
          comments &&
          comments
            ?.slice(0)
            ?.reverse()
            ?.map((rating) => (
              <Paper
                sx={{
                  padding: 2,
                  marginBottom: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                }}
                key={rating._id}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={2.5}>
                    <Stack direction="column" spacing={2}>
                      <Avatar
                        alt={rating.name}
                        sx={{
                          width: 40,
                          height: 40,
                          textTransform: "capitalize",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          component="span"
                          sx={{
                            textTransform: "capitalize",
                            fontWeight: "500",
                          }}
                        >
                          {rating?.author?.name.charAt(0)}
                        </Typography>
                      </Avatar>
                      <Typography
                        variant="body2"
                        component="p"
                        sx={{
                          textTransform: "capitalize",
                          fontWeight: "500",
                        }}
                      >
                        {rating.author.name}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={9.5}>
                    <Typography
                      variant="body2"
                      color="textPrimary"
                      component="p"
                    >
                      {rating.name}
                    </Typography>
                    <Rating name="read-only" value={rating.rating} readOnly />
                    <Typography
                      variant="body2"
                      color="textPrimary"
                      component="p"
                      fontWeight={500}
                    >
                      {new Date(rating.createdAt).toDateString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textPrimary"
                      component="p"
                      mt={2}
                      fontWeight={500}
                    >
                      {rating.comment}
                    </Typography>
                  </Grid>
                </Grid>
                {userId === rating.author._id && (
                  <div>
                    <IconButton
                      color="success"
                      onClick={() => {
                        setReviewId(rating._id);
                      }}
                    >
                      <FaEdit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(rating._id)}
                    >
                      <FaTrash />
                    </IconButton>
                  </div>
                )}
              </Paper>
            ))
        ) : (
          <Typography
            variant="body2"
            color="textPrimary"
            component="p"
            style={{ marginLeft: "47px", marginTop: "10px" }}
          >
            No Reviews Yet
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default ReviewCard;
