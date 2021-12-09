import React, { useEffect, useRef } from "react";
import { useRecoilValue, useResetRecoilState } from "recoil";
import styled from "styled-components";

import SamplesContainer from "./SamplesContainer";
import HorizontalNav from "../components/HorizontalNav";
import SampleModal from "../components/SampleModal";
import * as selectors from "../recoil/selectors";
import { useOutsideClick, useScreenshot, useGA } from "../utils/hooks";
import Loading from "../components/Loading";
import * as schemaAtoms from "../recoil/schema";
import { useClearModal } from "../recoil/utils";

const PLOTS = ["Sample tags", "Label tags", "Labels", "Other fields"];

const Container = styled.div`
  height: calc(100% - 74px);
  display: flex;
  flex-direction: column;
`;

const Body = styled.div`
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const useResetPaths = () => {
  const dataset = useRecoilValue(selectors.datasetName);
  const resetPaths = useResetRecoilState(
    schemaAtoms.activeFields({ modal: false })
  );
  useEffect(() => {
    resetPaths();
  }, [dataset]);
};

function Dataset() {
  const ref = useRef();
  const isModalActive = useRecoilValue(selectors.isModalActive);
  const hasDataset = useRecoilValue(selectors.hasDataset);

  useGA();
  useScreenshot();
  useResetPaths();

  const clearModal = useClearModal();
  useOutsideClick(ref, clearModal);

  useEffect(() => {
    document.body.classList.toggle("noscroll", isModalActive);
  }, [isModalActive]);

  return (
    <>
      {isModalActive && <SampleModal onClose={clearModal} ref={ref} />}
      <Container key={1}>
        {hasDataset ? (
          <>
            <HorizontalNav entries={PLOTS} key={"nav"} />
            <Body key={"body"}>
              <SamplesContainer key={"samples"} />
            </Body>
          </>
        ) : (
          <Loading text={"No dataset selected"} key={"loading"} />
        )}
      </Container>
    </>
  );
}

export default React.memo(Dataset);
