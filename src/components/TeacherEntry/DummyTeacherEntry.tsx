import React from 'react';
import TeacherEntry from './TeacherEntry';
import { AbsenceState, Period } from '../../lib/types/types';

export interface DummyTeacherEntryProps {
    name: string;
    starred: boolean;
    absenceState: { state: AbsenceState; periods: string[] };
    minimalist: boolean;

    periods: Period[];
}

export default function DummyTeacherEntry({
    name,
    starred,
    absenceState,
    minimalist,
    periods,
}: DummyTeacherEntryProps) {
    const honorific = name.split(' ')[0];
    const noHonorific = name.split(' ').slice(1).join(' ');
    const last = noHonorific.split(' ').slice(1).join(' ');

    return (
        <TeacherEntry
            teacher={{
                id: name,
                fullyAbsent: absenceState.state === AbsenceState.ABSENT_ALL_DAY,
                absence: absenceState.periods,
                name: {
                    last,
                    honorific,
                    normal: `${honorific} ${last}`,
                },
                displayName: `${honorific} ${last}`,
            }}
            starred={starred}
            setStar={() => {}}
            minimalist={minimalist}
            absent={absenceState.state}
            hapticfeedback={false}
            idx={0}
            periods={periods}
            disableInteraction={true}
        />
    );
}
