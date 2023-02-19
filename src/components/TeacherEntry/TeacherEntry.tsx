import { View, Text, Pressable, ColorValue } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { AbsenceState, TeacherEntryProps } from '../../lib/types';
import { useCallback } from 'react';

const STAR_SIZE = 25;

function getAbsentIcon(status: AbsenceState): JSX.Element {
    switch (status) {
        case AbsenceState.ABSENT:
            return ( <Icon color="red" size={30} name="close-sharp"></Icon> )
        case AbsenceState.PRESENT:
            return ( <Icon color="lime" size={30} name="checkmark-outline"></Icon> );
        default:
            return ( <Icon color="gray" size={30} name="ellipse"></Icon> );
    }
}

export default function TeacherEntry(props: TeacherEntryProps) {
    const starred = props.starred;
    const { id, name } = props.teacher;
    const toggleStar = props.setStar;
    
    const toggle = useCallback(() => toggleStar(id), [id]);

    return (
        <View className="flex flex-row p-2 m-2 justify-between" id={id}>
            <View className="flex flex-row space-x-3 my-auto">
                <View className="my-auto">
                    {
                        getAbsentIcon(props.absent)
                    }
                </View>

                {
                starred ? 
                    (
                        <Text className="text-yellow-400 my-auto text-lg">{name}</Text>
                    ) : 
                    (
                        <Text className="text-white my-auto text-lg">{name}</Text>
                    )
                }
            </View>
            <Pressable onPress={ toggle } hitSlop={2}>
                {
                starred ? 
                (
                    <Icon name="star" size={STAR_SIZE} color="yellow" />
                ) :
                (
                    <Icon name="star-outline" size={STAR_SIZE} color="gray" />
                )
                }
            </Pressable>
        </View>
    )

}