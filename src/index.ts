import { updateLecturesPeriodically } from "./lectureUpdater";

import { createSocket } from "./socket";

createSocket();
updateLecturesPeriodically();
