import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'photo'
})
export class PhotoPipe implements PipeTransform {
	transform(value: string): string {
		return value ? value : '../../../../assets/images/faces-clipart/profile.png';
	}
}
