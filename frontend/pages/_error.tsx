import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

const PageText = styled(Typography)`
  margin-top: 40vh;
  font-weight: bold;
`;

interface Response {
  statusCode?: number;
}

interface ErrorProps {
  statusCode: number;
}

const Error = (props: ErrorProps) => {
  return (
    <>
      <PageText variant="h2" align="center">
        {props.statusCode}
      </PageText>
    </>
  );
};

Error.getInitialProps = ({ res, err }: { res: Response; err: Response }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
