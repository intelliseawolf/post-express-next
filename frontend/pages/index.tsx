import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

const HomeText = styled(Typography)`
  margin-top: 40vh;
  font-weight: bold;
`;

const Homepage = () => {
  return (
    <>
      <HomeText variant="h2" align="center">
        Welcome to the Post App
      </HomeText>
    </>
  );
};

export default Homepage;
