import styled from "styled-components";
import { space } from "styled-system";

export const FilledButton = styled.button`
  ${space};
  outline: none;
  border-radius: 26.5px;
  transition: all 0.2s ease-in-out;
  min-width: 160px;
  max-width: 192px;

  padding: 9px 19px;

  background-color: #2924fb;
  border: solid 2px #2924fb;

  font-size: 15px;
  font-weight: bold;
  color: white;

  :hover {
    background-color: #6e6afc;
    border-color: #6e6afc;
    cursor: pointer;
  }

  :active {
    background-color: #a5a3fd;
    border-color: #a5a3fd;
  }
`;
