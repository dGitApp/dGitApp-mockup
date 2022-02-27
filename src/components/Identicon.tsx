import { useEffect, useRef } from "react";
import { useEthers } from "@usedapp/core";
import Jazzicon from "@metamask/jazzicon";
import styled from "@emotion/styled";

const StyledIdenticon = styled.div`
  height: 4.2rem;
  width: 4.2rem;
  border-radius: 2.1rem;
  background-color: black;
`;

export default function Identicon() {
  const ref = useRef<HTMLDivElement>();
  const { account } = useEthers();

  useEffect(() => {
    if (account && ref.current) {
      ref.current.innerHTML = "";
      ref.current.appendChild(Jazzicon(66, parseInt(account.slice(2, 10), 16)));
    }
  }, [account]);

  return <StyledIdenticon ref={ref as any} />;
}
