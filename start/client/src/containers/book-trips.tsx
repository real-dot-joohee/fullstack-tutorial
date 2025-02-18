import React from "react";
import { gql, useMutation } from "@apollo/client";

import Button from "../components/button";
import { GET_LAUNCH } from "./cart-item";
import * as GetCartItemsTypes from "../pages/__generated__/GetCartItems";
import * as BookTripsTypes from "./__generated__/BookTrips";
import { GET_LAUNCH_DETAILS } from "../pages/launch";

export const BOOK_TRIPS = gql`
  mutation BookTrips($launchIds: [ID]!) {
    bookTrips(launchIds: $launchIds) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

interface BookTripsProps extends GetCartItemsTypes.GetCartItems {}

const BookTrips: React.FC<BookTripsProps> = ({ cartItems }) => {
  const [bookTrips, { data }] = useMutation(BOOK_TRIPS, {
    variables: { launchIds: cartItems },
    refetchQueries: cartItems.map((launchId) => ({
      query: GET_LAUNCH_DETAILS,
      variables: { launchId },
    })),
    update(cache) {
      // cache.writeData({ data: { cartItems: [] } });
      cache.writeQuery({
        query: gql`
          query GetCartItems {
            cartItems
          }
        `,
        data: {
          cartItems: [],
        },
      });
    },
  });
  return data && data.bookTrips && !data.bookTrips.success ? (
    <p data-testid="message">{data.bookTrips.message}</p>
  ) : (
    <Button onClick={() => bookTrips()} data-testid="book-button">
      Book All
    </Button>
  );
};

export default BookTrips;
